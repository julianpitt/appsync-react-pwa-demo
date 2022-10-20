import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AccountRecovery,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito';
import { FederatedPrincipal, ManagedPolicy, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AuthStack extends Stack {
  userPool: UserPool;
  authRole: Role;
  unauthRole: Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, 'userpool', {
      userPoolName: 'pwa-demo-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
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
    });
    this.userPool = userPool;

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
