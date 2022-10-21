export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: string;
  AWSDateTime: string;
  AWSEmail: string;
  AWSIPAddress: string;
  AWSJSON: string;
  AWSPhone: string;
  AWSTime: string;
  AWSTimestamp: number;
  AWSURL: string;
};

export type Mutation = {
  __typename?: 'Mutation';
  sendNotification: Scalars['Boolean'];
  subscribeToNotifications: Scalars['Boolean'];
  unsubscribeToNotifications: Scalars['Boolean'];
};


export type MutationSendNotificationArgs = {
  input: NotificationInput;
};


export type MutationSubscribeToNotificationsArgs = {
  input: SubscribeInput;
};


export type MutationUnsubscribeToNotificationsArgs = {
  input: UnsubscribeInput;
};

export type NotificationInput = {
  body: Scalars['String'];
  icon: Scalars['String'];
  title: Scalars['String'];
  userPoolGroups: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getUserSubscriptions: Array<UserSubscription>;
};

export type SubscribeInput = {
  endpoint: Scalars['String'];
  keys: SubscriptionKeys;
};

export type SubscriptionKeys = {
  auth: Scalars['String'];
  p256dh: Scalars['String'];
};

export type SubscriptionStatus = {
  __typename?: 'SubscriptionStatus';
  subscribed: Scalars['Boolean'];
};

export type UnsubscribeInput = {
  endpoint: Scalars['String'];
};

export type UserSubscription = {
  __typename?: 'UserSubscription';
  endpoint: Scalars['String'];
  userId: Scalars['String'];
  userPoolGroup: Scalars['String'];
};

export type GetUserSubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserSubscriptionsQuery = { __typename?: 'Query', getUserSubscriptions: Array<{ __typename?: 'UserSubscription', userId: string, userPoolGroup: string, endpoint: string }> };

export type SubscribeToNotificationsMutationVariables = Exact<{
  input: SubscribeInput;
}>;


export type SubscribeToNotificationsMutation = { __typename?: 'Mutation', subscribeToNotifications: boolean };

export type UnsubscribeToNotificationsMutationVariables = Exact<{
  input: UnsubscribeInput;
}>;


export type UnsubscribeToNotificationsMutation = { __typename?: 'Mutation', unsubscribeToNotifications: boolean };

export type SendNotificationMutationVariables = Exact<{
  input: NotificationInput;
}>;


export type SendNotificationMutation = { __typename?: 'Mutation', sendNotification: boolean };
