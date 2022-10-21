import { AppSyncResolverHandler } from 'aws-lambda';
import {
  SendNotificationMutation,
  SendNotificationMutationVariables,
} from '../../../lib/shared/appsync-gen';
import { getDDBClient, getSubscriptionsByGroup } from '../../libs/ddb';
import * as webPush from 'web-push';

export const handler: AppSyncResolverHandler<
  SendNotificationMutationVariables,
  SendNotificationMutation['sendNotification']
> = async event => {
  const { tableName, publicKey, privateKey, identifier } = process.env;

  if (!tableName) {
    throw new Error(`Missing required env var "tableName"`);
  }

  if (!publicKey) {
    throw new Error(`Missing required env var "publicKey"`);
  }

  if (!privateKey) {
    throw new Error(`Missing required env var "privateKey"`);
  }

  if (!identifier) {
    throw new Error(`Missing required env var "identifier"`);
  }

  const { body, userPoolGroups, icon, title } = event.arguments.input;
  const { docClient } = getDDBClient();

  const subscriptionResult = await getSubscriptionsByGroup(docClient, tableName, userPoolGroups);

  webPush.setVapidDetails(identifier, publicKey, privateKey);

  await Promise.all(
    subscriptionResult.map(async subscription => {
      const pushConfig = {
        endpoint: subscription.endpoint,
        keys: subscription.authKeys,
      };
      await webPush.sendNotification(
        pushConfig,
        JSON.stringify({
          // this can be any payload
          title: title,
          icon: icon,
          content: body,
          openUrl: '/',
        }),
      );
    }),
  );

  return true;
};
