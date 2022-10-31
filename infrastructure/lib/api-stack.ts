import { Construct } from 'constructs'; // constructs provisions AWS resources - L1/L2/L3
import * as cdk from 'aws-cdk-lib'; // cdk - define cloud infra using code/preferred programming lang
import * as fs from 'fs';
import * as path from 'path';
import {
  CfnDataSource,
  CfnResolver,
  CfnGraphQLApi,
  CfnGraphQLSchema,
} from 'aws-cdk-lib/aws-appsync';
import {
  Effect,
  IRole,
  ManagedPolicy,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Query, Mutation, Subscription } from './shared/appsync-gen';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

interface ApiStackProps extends cdk.StackProps {
  unauthRole: Role;
  authRole: Role;
  userPool: UserPool;
  database: Table;
  vapidDetails: {
    publicKey: string;
    privateKey: string;
    identifier: string;
  };
}

export const lambdaProps = (
  env = {} as Record<string, string>,
): Partial<cdk.aws_lambda_nodejs.NodejsFunctionProps> => ({
  bundling: { minify: true, sourceMap: true },
  timeout: cdk.Duration.seconds(15),
  memorySize: 256,
  environment: {
    NODE_OPTIONS: '--enable-source-maps',
    ...env,
  },
  runtime: Runtime.NODEJS_16_X,
});

type AppSyncFunction = {
  envs?: Record<string, string>;
  functionName: string;
  permissions: 'anonymous' | 'authorised' | 'all';
} & (
  | {
      typeName: 'Query';
      fieldName: keyof Query;
    }
  | {
      typeName: 'Mutation';
      fieldName: keyof Mutation;
    }
  | {
      typeName: 'Subscription';
      fieldName: keyof Subscription;
    }
);

// Stack definition
export class ApiStack extends cdk.Stack {
  private anonymousFunctions: CfnResolver[] = [];
  private authorizedFunctions: CfnResolver[] = [];
  private functions: NodejsFunction[] = [];

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // allow the role to call the lambda resolvers
    const invokeLambdaRole = new Role(this, 'appsync-invoke-lambda-role', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    });

    // creates role with full access to cloudwatch logs
    const apiLogRole = new Role(this, 'appsync-log-role', {
      assumedBy: new ServicePrincipal('appsync'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsFullAccess')],
    });

    // creates GraphQL api
    const api = new CfnGraphQLApi(this, 'graphql-api', {
      name: 'pwa-demo-graphql-api',
      logConfig: {
        cloudWatchLogsRoleArn: apiLogRole.roleArn,
        fieldLogLevel: 'ALL',
      },
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
      userPoolConfig: {
        userPoolId: props.userPool.userPoolId,
        awsRegion: cdk.Stack.of(this).region,
        defaultAction: 'ALLOW',
      },
      additionalAuthenticationProviders: [
        // for subscriptions
        {
          authenticationType: 'AWS_IAM',
        },
      ],
    });

    const apiSchemaFile = fs.readFileSync(path.join(__dirname, '../', 'api', 'schema.graphql'));

    const apiSchema = new CfnGraphQLSchema(this, 'api-schema', {
      apiId: api.attrApiId,
      definition: apiSchemaFile.toString(),
    });

    const noneDataSource = new CfnDataSource(this, `noneDatasource`, {
      apiId: api.attrApiId,
      // Note: property 'name' cannot include hyphens
      name: `NoneDS`,
      type: 'NONE',
    });

    // map the AppSync Query to the Lambda function
    const sendWSResolver = new CfnResolver(this, `sendWSMutationResolver`, {
      apiId: api.attrApiId,
      typeName: 'Mutation',
      fieldName: 'sendWSMessage',
      dataSourceName: noneDataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "payload": $utils.toJson($context.arguments)
      }`,
      responseMappingTemplate: '$util.toJson($context.result)',
    });
    sendWSResolver.addDependsOn(apiSchema);

    const subscriptionResolver = new CfnResolver(this, `inAppNotificationSubscriptionResolver`, {
      apiId: api.attrApiId,
      typeName: 'Subscription',
      fieldName: 'inAppNotifications',
      dataSourceName: noneDataSource.name,
      requestMappingTemplate: `{
        "version": "2018-05-29",
        "payload": {
          "title": "",
          "group": ""
        }
      }`,
      responseMappingTemplate: `
        #set($claimPermissions = $ctx.identity.claims.get("cognito:groups"))
        $extensions.setSubscriptionFilter({
            "filterGroup": [
                {
                  "filters" : [
                        {
                            "fieldName" : "group",
                            "operator" : "in",
                            "value" : $claimPermissions
                        }
                  ]
                }
            ]
        })
        $util.toJson($context.result)
      `,
    });
    subscriptionResolver.addDependsOn(apiSchema);

    // ------------- FUNCTIONS  -------------

    const { lambdaFunction: getUserSubscriptionFunction } = this.attachFunctionToAppSync(
      {
        envs: {
          tableName: props.database.tableName,
        },
        functionName: 'getUserSubscriptions',
        typeName: 'Query',
        fieldName: 'getUserSubscriptions',
        permissions: 'authorised',
      },
      api,
      apiSchema,
      invokeLambdaRole,
    );
    props.database.grant(getUserSubscriptionFunction, 'dynamodb:Query');

    const { lambdaFunction: subscribeToNotificationsFunction } = this.attachFunctionToAppSync(
      {
        envs: {
          tableName: props.database.tableName,
        },
        functionName: 'subscribeToNotifications',
        typeName: 'Mutation',
        fieldName: 'subscribeToNotifications',
        permissions: 'authorised',
      },
      api,
      apiSchema,
      invokeLambdaRole,
    );
    props.database.grant(subscribeToNotificationsFunction, 'dynamodb:PutItem');

    const { lambdaFunction: unsubscribeToNotificationsFunction } = this.attachFunctionToAppSync(
      {
        envs: {
          tableName: props.database.tableName,
        },
        functionName: 'unsubscribeToNotifications',
        typeName: 'Mutation',
        fieldName: 'unsubscribeToNotifications',
        permissions: 'authorised',
      },
      api,
      apiSchema,
      invokeLambdaRole,
    );
    props.database.grant(unsubscribeToNotificationsFunction, 'dynamodb:DeleteItem');

    const { lambdaFunction: sendNotificationFunction } = this.attachFunctionToAppSync(
      {
        envs: {
          tableName: props.database.tableName,
          publicKey: props.vapidDetails.publicKey,
          privateKey: props.vapidDetails.privateKey,
          identifier: props.vapidDetails.identifier,
          appSyncEndpoint: api.getAtt('GraphQLUrl').toString(),
        },
        functionName: 'sendNotification',
        typeName: 'Mutation',
        fieldName: 'sendNotification',
        permissions: 'authorised',
      },
      api,
      apiSchema,
      invokeLambdaRole,
    );
    props.database.grant(sendNotificationFunction, 'dynamodb:Query');
    sendNotificationFunction.role?.attachInlinePolicy(
      new Policy(this, 'sendWSMutationPolicy', {
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [cdk.Fn.join('', [api.ref, '/types/Mutation/fields/sendWSMessage'])],
            actions: ['appsync:GraphQL'],
          }),
        ],
      }),
    );

    this.attachLambdaPermissionsToAppSync(invokeLambdaRole);

    const unauthedRole = Role.fromRoleArn(this, 'unauthed-role', props.unauthRole.roleArn);
    const authedRole = Role.fromRoleArn(this, 'authed-role', props.authRole.roleArn);

    this.attachLambdaFunctionsToAuth(authedRole, unauthedRole);

    // ------------- OUTPUTS SECTION -------------
    new cdk.CfnOutput(this, 'GraphQLAPIEndpoint', {
      value: api.attrGraphQlUrl,
    });
  }

  attachFunctionToAppSync(
    { envs = {}, functionName, typeName, fieldName, permissions }: AppSyncFunction,
    api: CfnGraphQLApi,
    apiSchema: CfnGraphQLSchema,
    invokeLambdaRole: Role,
  ) {
    const lambdaFunction = new NodejsFunction(this, `${functionName}Function`, {
      ...lambdaProps(envs),
      functionName,
      handler: 'handler',
      entry: path.join(__dirname, `../api/resolvers/${functionName}/index.ts`),
    });
    this.functions.push(lambdaFunction);

    // Make the lambda fuinction a datasource for the AppSync Api
    const dataSource = new CfnDataSource(this, `${functionName}Datasource`, {
      apiId: api.attrApiId,
      // Note: property 'name' cannot include hyphens
      name: `${functionName}Function`,
      type: 'AWS_LAMBDA',
      lambdaConfig: {
        lambdaFunctionArn: lambdaFunction.functionArn,
      },
      serviceRoleArn: invokeLambdaRole.roleArn,
    });

    // map the AppSync Query to the Lambda function
    const resolver = new CfnResolver(this, `${functionName}Resolver`, {
      apiId: api.attrApiId,
      typeName,
      fieldName,
      dataSourceName: dataSource.name,
    });

    resolver.addDependsOn(apiSchema);

    if (permissions === 'all' || permissions === 'anonymous') {
      this.anonymousFunctions.push(resolver);
    }
    if (permissions === 'all' || permissions === 'authorised') {
      this.authorizedFunctions.push(resolver);
    }

    return {
      lambdaFunction,
      resolver,
      dataSource,
    };
  }

  attachLambdaPermissionsToAppSync(invokeLambdaRole: Role) {
    // Allow AppSync to invoke the function
    invokeLambdaRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: this.functions.map(fn => fn.functionArn),
        actions: ['lambda:InvokeFunction'],
      }),
    );
  }

  attachLambdaFunctionsToAuth(authedRole: IRole, unauthedRole: IRole) {
    if (this.authorizedFunctions.length > 0) {
      authedRole.attachInlinePolicy(
        new Policy(this, 'invokeGraphqlAuthedPolicy', {
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              resources: this.authorizedFunctions.map(resolver =>
                cdk.Fn.join('fields', cdk.Fn.split('resolvers', resolver.attrResolverArn)),
              ),
              actions: ['appsync:GraphQL'],
            }),
          ],
        }),
      );
    }

    if (this.anonymousFunctions.length > 0) {
      unauthedRole.attachInlinePolicy(
        new Policy(this, 'invokeGraphqlUnauthedPolicy', {
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              resources: this.anonymousFunctions.map(resolver =>
                cdk.Fn.join('fields', cdk.Fn.split('resolvers', resolver.attrResolverArn)),
              ),
              actions: ['appsync:GraphQL'],
            }),
          ],
        }),
      );
    }
  }
}
