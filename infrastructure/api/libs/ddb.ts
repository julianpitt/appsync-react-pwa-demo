import existingGroups from '../../../shared/groups';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';

export function getDDBClient() {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  return { client, docClient };
}

export async function getSubscriptionsByGroup(
  docClient: DynamoDBDocumentClient,
  tableName: string,
  groups: string[],
): Promise<Pick<Subscription, 'endpoint' | 'authKeys'>[]> {
  // Validate groups
  groups.forEach(group => {
    if (!existingGroups.includes(group)) {
      throw new Error(`The provided userPoolGroup ${group} doesn't exist`);
    }
  });

  const responses = await Promise.all(
    groups.map(async (group): Promise<Subscription[]> => {
      const commandInput: QueryCommandInput = {
        TableName: tableName,
        IndexName: 'byGroup',
        KeyConditionExpression: '#group = :group',
        ProjectionExpression: 'endpoint, authKeys',
        ExpressionAttributeNames: {
          '#group': 'userPoolGroup',
        },
        ExpressionAttributeValues: {
          ':group': group,
        },
      };
      const command = new QueryCommand(commandInput);
      const response = await docClient.send(command);
      return (response.Items || []) as Subscription[];
    }),
  );

  const allSubscriptions = ([] as Subscription[]).concat.apply([], responses);

  return allSubscriptions;
}

export async function getSubscriptionsByUser(
  docClient: DynamoDBDocumentClient,
  tableName: string,
  userId: string,
  group: string,
) {
  const commandInput: QueryCommandInput = {
    TableName: tableName,
    IndexName: 'byGroup',
    KeyConditionExpression: '#PK = :PK AND #SK = :SK',
    ProjectionExpression: 'endpoint, userId, userPoolGroup',
    ExpressionAttributeNames: {
      '#PK': 'userPoolGroup',
      '#SK': 'userId',
    },
    ExpressionAttributeValues: {
      ':PK': group,
      ':SK': userId,
    },
  };
  const command = new QueryCommand(commandInput);
  const response = await docClient.send(command);
  return (response.Items || []) as Subscription[];
}

export async function removeSubscription(
  docClient: DynamoDBDocumentClient,
  tableName: string,
  endpoint: string,
  userId: string,
) {
  const commandInput: DeleteCommandInput = {
    TableName: tableName,
    Key: {
      endpoint,
    },
    ExpressionAttributeNames: {
      '#userId': 'userId',
    },
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ConditionExpression: '#userId = :userId',
  };
  const command = new DeleteCommand(commandInput);
  await docClient.send(command);
}

export async function createSubscription(
  docClient: DynamoDBDocumentClient,
  tableName: string,
  subscription: Subscription,
): Promise<void> {
  if (!existingGroups.includes(subscription.userPoolGroup)) {
    throw new Error(`The provided userPoolGroup ${subscription.userPoolGroup} doesn't exist`);
  }

  const commandInput: PutCommandInput = {
    TableName: tableName,
    Item: subscription,
  };

  const command = new PutCommand(commandInput);
  await docClient.send(command);
}
