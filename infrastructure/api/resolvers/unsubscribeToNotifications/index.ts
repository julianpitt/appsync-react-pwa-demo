import { AppSyncIdentityCognito, AppSyncResolverHandler } from 'aws-lambda';
import {
  UnsubscribeToNotificationsMutation,
  UnsubscribeToNotificationsMutationVariables,
} from '../../../lib/shared/appsync-gen';
import { getDDBClient, removeSubscription } from '../../libs/ddb';

export const handler: AppSyncResolverHandler<
  UnsubscribeToNotificationsMutationVariables,
  UnsubscribeToNotificationsMutation['unsubscribeToNotifications']
> = async event => {
  const { tableName } = process.env;

  if (!tableName) {
    throw new Error(`Missing required env var "tableName"`);
  }

  const { endpoint } = event.arguments.input;
  const { sub } = event.identity as AppSyncIdentityCognito;

  const { docClient } = getDDBClient();
  await removeSubscription(docClient, tableName, endpoint, sub);

  return true;
};
