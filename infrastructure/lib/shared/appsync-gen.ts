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

export type ActionStatus = {
  __typename?: 'ActionStatus';
  message?: Maybe<Scalars['String']>;
  status: Status;
};

export type Mutation = {
  __typename?: 'Mutation';
  sendNotification: Scalars['Boolean'];
  subscribeToNotifications: ActionStatus;
  unsubscribeToNotifications: ActionStatus;
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
  group: Scalars['String'];
  icon: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getSubscriptionStatus: SubscriptionStatus;
};


export type QueryGetSubscriptionStatusArgs = {
  input?: InputMaybe<SubscriptionStatusInput>;
};

export enum Status {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export type SubscribeInput = {
  authKey: Scalars['String'];
  endpoint: Scalars['String'];
  p256dh: Scalars['String'];
  subscriptionId: Scalars['String'];
};

export type SubscriptionStatus = {
  __typename?: 'SubscriptionStatus';
  subscribed: Scalars['Boolean'];
};

export type SubscriptionStatusInput = {
  subscriptionId: Scalars['String'];
};

export type UnsubscribeInput = {
  subscriptionId: Scalars['String'];
};

export type GetSubscriptionStatusQueryVariables = Exact<{
  input: SubscriptionStatusInput;
}>;


export type GetSubscriptionStatusQuery = { __typename?: 'Query', getSubscriptionStatus: { __typename?: 'SubscriptionStatus', subscribed: boolean } };

export type SubscribeToNotificationsMutationVariables = Exact<{
  input: SubscribeInput;
}>;


export type SubscribeToNotificationsMutation = { __typename?: 'Mutation', subscribeToNotifications: { __typename?: 'ActionStatus', status: Status, message?: string | null } };

export type UnubscribeToNotificationsMutationVariables = Exact<{
  input: UnsubscribeInput;
}>;


export type UnubscribeToNotificationsMutation = { __typename?: 'Mutation', unsubscribeToNotifications: { __typename?: 'ActionStatus', status: Status, message?: string | null } };

export type SendNotificationMutationVariables = Exact<{
  input: NotificationInput;
}>;


export type SendNotificationMutation = { __typename?: 'Mutation', sendNotification: boolean };
