import { AppSyncIdentityCognito, AppSyncResolverHandler } from 'aws-lambda';
import {
  SendNotificationMutation,
  SendNotificationMutationVariables,
} from '../../../lib/shared/appsync-gen';
import { getDDBClient, getSubscriptionsByGroup } from '../../libs/ddb';
import * as webPush from 'web-push';
import { makeRequest } from './appsync';
import { requiredEnvs } from '../../utils/env';

export const handler: AppSyncResolverHandler<
  SendNotificationMutationVariables,
  SendNotificationMutation['sendNotification']
> = async event => {
  if (
    !event.identity ||
    !('groups' in event.identity) ||
    !event.identity.groups ||
    !event.identity.groups.includes('admin')
  ) {
    throw new Error('only admins can send messages');
  }

  const { tableName, publicKey, privateKey, identifier, appSyncEndpoint } = requiredEnvs(
    'tableName',
    'publicKey',
    'privateKey',
    'identifier',
    'appSyncEndpoint',
  );

  const { body, userPoolGroups, icon, title } = event.arguments.input;
  const { docClient } = getDDBClient();

  const subscriptionResult = await getSubscriptionsByGroup(docClient, tableName, userPoolGroups);

  webPush.setVapidDetails(identifier, publicKey, privateKey);

  console.log(`sending push notifications for ${subscriptionResult.length}`);
  const browserNotifications = Promise.all(
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

  const mutation = /* GraphQL */ `
    mutation SendWSMessage($group: String!, $title: String!, $body: String) {
      sendWSMessage(group: $group, title: $title, body: $body) {
        group
        title
        body
      }
    }
  `;

  const region = process.env.AWS_REGION || 'ap-southeast-1';
  const wsNotifications = Promise.all(
    userPoolGroups.map(async group => {
      console.log(`firing subscription mutation for ${group}`);
      const variables = {
        group,
        title,
        body,
      };

      const response = await makeRequest(appSyncEndpoint, region, mutation, variables);
      console.log(JSON.stringify(response, null, 2));
    }),
  );

  await Promise.all([browserNotifications, wsNotifications]);

  return true;
};
