import { Construct } from 'constructs'; // constructs provisions AWS resources - L1/L2/L3
import * as cdk from 'aws-cdk-lib'; // cdk - define cloud infra using code/preferred programming lang
import fs = require('fs');
import path = require('path');
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
import { Query, Mutation } from './shared/appsync-gen';

interface ApiStackProps extends cdk.StackProps {
  unauthRole: Role;
  authRole: Role;
}

const lambdaProps = (env = {} as Record<string, string>) => ({
  bundling: { minify: true, sourceMap: true },
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
      name: 'search-app-graphql-api',
      logConfig: {
        cloudWatchLogsRoleArn: apiLogRole.roleArn,
        fieldLogLevel: 'ALL',
      },
      authenticationType: 'AWS_IAM',
    });

    const apiSchemaFile = fs.readFileSync(path.join(__dirname, '../', 'api', 'schema.graphql'));

    const apiSchema = new CfnGraphQLSchema(this, 'api-schema', {
      apiId: api.attrApiId,
      definition: apiSchemaFile.toString(),
    });

    const { lambdaFunction: getApplicationConfigFunction } = this.attachFunctionToAppSync(
      {
        envs: {
          tableName: props.database.tableName,
        },
        functionName: 'getApplicationConfig',
        typeName: 'Query',
        fieldName: 'getApplicationConfig',
        permissions: 'all',
      },
      api,
      apiSchema,
      invokeLambdaRole,
    );

    // Give the getApplicationConfigFn permission to query DynamoDB
    props.database.grant(getApplicationConfigFunction, 'dynamodb:Query');

    const { lambdaFunction: searchProjectsFunction } = this.attachFunctionToAppSync(
      {
        envs: {},
        functionName: 'searchProjects',
        typeName: 'Query',
        fieldName: 'searchProjects',
        permissions: 'all',
      },
      api,
      apiSchema,
      invokeLambdaRole,
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
