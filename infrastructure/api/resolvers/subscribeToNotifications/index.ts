import { AppSyncIdentityCognito, AppSyncResolverHandler } from 'aws-lambda';
import {
  SubscribeToNotificationsMutation,
  SubscribeToNotificationsMutationVariables,
} from '../../../lib/shared/appsync-gen';
import { createSubscription, getDDBClient } from '../../libs/ddb';

export const handler: AppSyncResolverHandler<
  SubscribeToNotificationsMutationVariables,
  SubscribeToNotificationsMutation['subscribeToNotifications']
> = async event => {
  const { tableName } = process.env;

  if (!tableName) {
    throw new Error(`Missing required env var "tableName"`);
  }

  const subscription = event.arguments.input;
  let { sub, groups } = event.identity as AppSyncIdentityCognito;
  groups = groups === null ? [] : groups.filter(g => g !== 'admin');
  if (groups.length === 0) {
    throw new Error(`User missing groups`);
  }

  const { docClient } = getDDBClient();
  await createSubscription(docClient, tableName, {
    authKeys: subscription.keys,
    endpoint: subscription.endpoint,
    userId: sub,
    userPoolGroup: groups[0]!,
  });

  return true;
};
