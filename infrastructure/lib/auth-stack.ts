import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AccountRecovery,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolGroup,
  StringAttribute,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito';
import {
  FederatedPrincipal,
  ManagedPolicy,
  Policy,
  PolicyStatement,
  Role,
} from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import groups from '../../shared/groups';
import { lambdaProps } from './api-stack';
import * as path from 'path';

export class AuthStack extends Stack {
  userPool: UserPool;
  authRole: Role;
  unauthRole: Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const preSignUpFunction = new NodejsFunction(this, `preSignUpFunction`, {
      ...lambdaProps(),
      functionName: 'preSignUpFunction',
      handler: 'handler',
      entry: path.join(__dirname, `../lib/auth/preSignUpFunction/index.ts`),
    });

    const postConfFunction = new NodejsFunction(this, `postConfirmationFunction`, {
      ...lambdaProps(),
      functionName: 'postConfirmationFunctionFunction',
      handler: 'handler',
      entry: path.join(__dirname, `../lib/auth/postConfirmationFunction/index.ts`),
    });

    const userPool = new UserPool(this, 'userpool', {
      userPoolName: 'pwa-demo-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: false,
        requireDigits: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
      lambdaTriggers: {
        preSignUp: preSignUpFunction,
        postConfirmation: postConfFunction,
      },
      customAttributes: {
        groupName: new StringAttribute({ mutable: true }),
      },
    });
    this.userPool = userPool;

    postConfFunction.role!.attachInlinePolicy(
      new Policy(this, 'userpool-postconfirm-fn-policy', {
        statements: [
          new PolicyStatement({
            actions: ['cognito-idp:AdminAddUserToGroup'],
            resources: [userPool.userPoolArn],
          }),
        ],
      }),
    );

    const userPoolClient = new UserPoolClient(this, 'userpool-client', {
      userPool,
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
    });

    const identityPool = new CfnIdentityPool(this, 'identity-pool', {
      identityPoolName: 'pwa-demo-identity-pool',
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    const anonymousRole = new Role(this, 'anonymous-group-role', {
      description: 'Default role for anonymous users',
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'unauthenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });
    this.unauthRole = anonymousRole;

    const userRole = new Role(this, 'users-group-role', {
      description: 'Default role for authenticated users',
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });
    this.authRole = userRole;

    new CfnIdentityPoolRoleAttachment(this, 'identity-pool-role-attachment', {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: userRole.roleArn,
        unauthenticated: anonymousRole.roleArn,
      },
      roleMappings: {
        mapping: {
          type: 'Token',
          ambiguousRoleResolution: 'AuthenticatedRole',
          identityProvider: `cognito-idp.${Stack.of(this).region}.amazonaws.com/${
            userPool.userPoolId
          }:${userPoolClient.userPoolClientId}`,
        },
      },
    });

    // Create all the groups
    const cfnUserPoolGroup = new CfnUserPoolGroup(this, 'admin-user-group', {
      userPoolId: userPool.userPoolId,
      groupName: 'admin',
      precedence: 1,
    });

    groups.forEach(group => {
      new CfnUserPoolGroup(this, group, {
        userPoolId: userPool.userPoolId,
        groupName: group,
        precedence: 2,
      });
    });

    new CfnOutput(this, 'userPoolId', {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, 'userPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    new CfnOutput(this, 'userIdentityPoolId', {
      value: identityPool.ref,
    });

    new CfnOutput(this, 'cognitoRegion', {
      value: Stack.of(this).region,
    });
  }
}
