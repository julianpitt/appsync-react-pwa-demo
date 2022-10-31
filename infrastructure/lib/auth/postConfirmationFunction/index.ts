import { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

export const handler: PostConfirmationTriggerHandler = async (event, context, callback) => {
  console.log(JSON.stringify(event));

  const { userPoolId, userName } = event;
  if (
    event.request.userAttributes.email &&
    event.triggerSource === 'PostConfirmation_ConfirmSignUp'
  ) {
    try {
      await adminAddUserToGroup({
        userPoolId,
        username: userName,
        groupName: event.request.userAttributes['custom:groupName'],
      });

      return callback(null, event);
    } catch (error) {
      return callback(error as Error, event);
    }
  } else {
    callback(null, event);
  }
};

export async function adminAddUserToGroup({
  userPoolId,
  username,
  groupName,
}: {
  userPoolId: string;
  username: string;
  groupName: string;
}) {
  const params = {
    GroupName: groupName,
    UserPoolId: userPoolId,
    Username: username,
  };

  const client = new CognitoIdentityProviderClient({});
  const command = new AdminAddUserToGroupCommand(params);
  const response = await client.send(command);

  return response;
}
