import { AppSyncIdentityCognito, AppSyncResolverHandler } from 'aws-lambda';
import {
  GetUserSubscriptionsQuery,
  GetUserSubscriptionsQueryVariables,
} from '../../../lib/shared/appsync-gen';
import { getDDBClient, getSubscriptionsByUser } from '../../libs/ddb';

export const handler: AppSyncResolverHandler<
  GetUserSubscriptionsQueryVariables,
  GetUserSubscriptionsQuery['getUserSubscriptions']
> = async event => {
  const { tableName } = process.env;

  if (!tableName) {
    throw new Error(`Missing required env var "tableName"`);
  }

  let { sub, groups } = event.identity as AppSyncIdentityCognito;
  groups = groups === null ? [] : groups.filter(g => g !== 'admin');
  if (groups.length === 0) {
    throw new Error(`User missing groups`);
  }

  const { docClient } = getDDBClient();
  const subscriptions = await getSubscriptionsByUser(docClient, tableName, sub, groups[0]);

  return subscriptions;
};
