import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type MessageEvent = {
  __typename?: 'MessageEvent';
  body?: Maybe<Scalars['String']>;
  group: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  sendNotification: Scalars['Boolean'];
  sendWSMessage: MessageEvent;
  subscribeToNotifications: Scalars['Boolean'];
  unsubscribeToNotifications: Scalars['Boolean'];
};


export type MutationSendNotificationArgs = {
  input: NotificationInput;
};


export type MutationSendWsMessageArgs = {
  body?: InputMaybe<Scalars['String']>;
  group: Scalars['String'];
  title: Scalars['String'];
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

export type Subscription = {
  __typename?: 'Subscription';
  inAppNotifications?: Maybe<MessageEvent>;
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

export type InAppNotificationsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type InAppNotificationsSubscription = { __typename?: 'Subscription', inAppNotifications?: { __typename?: 'MessageEvent', title: string, body?: string | null } | null };

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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AWSDate: ResolverTypeWrapper<Scalars['AWSDate']>;
  AWSDateTime: ResolverTypeWrapper<Scalars['AWSDateTime']>;
  AWSEmail: ResolverTypeWrapper<Scalars['AWSEmail']>;
  AWSIPAddress: ResolverTypeWrapper<Scalars['AWSIPAddress']>;
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']>;
  AWSPhone: ResolverTypeWrapper<Scalars['AWSPhone']>;
  AWSTime: ResolverTypeWrapper<Scalars['AWSTime']>;
  AWSTimestamp: ResolverTypeWrapper<Scalars['AWSTimestamp']>;
  AWSURL: ResolverTypeWrapper<Scalars['AWSURL']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  MessageEvent: ResolverTypeWrapper<MessageEvent>;
  Mutation: ResolverTypeWrapper<{}>;
  NotificationInput: NotificationInput;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  SubscribeInput: SubscribeInput;
  Subscription: ResolverTypeWrapper<{}>;
  SubscriptionKeys: SubscriptionKeys;
  SubscriptionStatus: ResolverTypeWrapper<SubscriptionStatus>;
  UnsubscribeInput: UnsubscribeInput;
  UserSubscription: ResolverTypeWrapper<UserSubscription>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AWSDate: Scalars['AWSDate'];
  AWSDateTime: Scalars['AWSDateTime'];
  AWSEmail: Scalars['AWSEmail'];
  AWSIPAddress: Scalars['AWSIPAddress'];
  AWSJSON: Scalars['AWSJSON'];
  AWSPhone: Scalars['AWSPhone'];
  AWSTime: Scalars['AWSTime'];
  AWSTimestamp: Scalars['AWSTimestamp'];
  AWSURL: Scalars['AWSURL'];
  Boolean: Scalars['Boolean'];
  MessageEvent: MessageEvent;
  Mutation: {};
  NotificationInput: NotificationInput;
  Query: {};
  String: Scalars['String'];
  SubscribeInput: SubscribeInput;
  Subscription: {};
  SubscriptionKeys: SubscriptionKeys;
  SubscriptionStatus: SubscriptionStatus;
  UnsubscribeInput: UnsubscribeInput;
  UserSubscription: UserSubscription;
};

export type AwsCognitoUserPoolsDirectiveArgs = { };

export type AwsCognitoUserPoolsDirectiveResolver<Result, Parent, ContextType = any, Args = AwsCognitoUserPoolsDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AwsIamDirectiveArgs = { };

export type AwsIamDirectiveResolver<Result, Parent, ContextType = any, Args = AwsIamDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface AwsDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDate'], any> {
  name: 'AWSDate';
}

export interface AwsDateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSDateTime'], any> {
  name: 'AWSDateTime';
}

export interface AwsEmailScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSEmail'], any> {
  name: 'AWSEmail';
}

export interface AwsipAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSIPAddress'], any> {
  name: 'AWSIPAddress';
}

export interface AwsjsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSJSON'], any> {
  name: 'AWSJSON';
}

export interface AwsPhoneScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSPhone'], any> {
  name: 'AWSPhone';
}

export interface AwsTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTime'], any> {
  name: 'AWSTime';
}

export interface AwsTimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSTimestamp'], any> {
  name: 'AWSTimestamp';
}

export interface AwsurlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['AWSURL'], any> {
  name: 'AWSURL';
}

export type MessageEventResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageEvent'] = ResolversParentTypes['MessageEvent']> = {
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  sendNotification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendNotificationArgs, 'input'>>;
  sendWSMessage?: Resolver<ResolversTypes['MessageEvent'], ParentType, ContextType, RequireFields<MutationSendWsMessageArgs, 'group' | 'title'>>;
  subscribeToNotifications?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSubscribeToNotificationsArgs, 'input'>>;
  unsubscribeToNotifications?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUnsubscribeToNotificationsArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getUserSubscriptions?: Resolver<Array<ResolversTypes['UserSubscription']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  inAppNotifications?: SubscriptionResolver<Maybe<ResolversTypes['MessageEvent']>, "inAppNotifications", ParentType, ContextType>;
};

export type SubscriptionStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionStatus'] = ResolversParentTypes['SubscriptionStatus']> = {
  subscribed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSubscription'] = ResolversParentTypes['UserSubscription']> = {
  endpoint?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userPoolGroup?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AWSDate?: GraphQLScalarType;
  AWSDateTime?: GraphQLScalarType;
  AWSEmail?: GraphQLScalarType;
  AWSIPAddress?: GraphQLScalarType;
  AWSJSON?: GraphQLScalarType;
  AWSPhone?: GraphQLScalarType;
  AWSTime?: GraphQLScalarType;
  AWSTimestamp?: GraphQLScalarType;
  AWSURL?: GraphQLScalarType;
  MessageEvent?: MessageEventResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SubscriptionStatus?: SubscriptionStatusResolvers<ContextType>;
  UserSubscription?: UserSubscriptionResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  aws_cognito_user_pools?: AwsCognitoUserPoolsDirectiveResolver<any, any, ContextType>;
  aws_iam?: AwsIamDirectiveResolver<any, any, ContextType>;
};


export const InAppNotificationsDocument = gql`
    subscription InAppNotifications {
  inAppNotifications {
    title
    body
  }
}
    `;
export const GetUserSubscriptionsDocument = gql`
    query GetUserSubscriptions {
  getUserSubscriptions {
    userId
    userPoolGroup
    endpoint
  }
}
    `;
export const SubscribeToNotificationsDocument = gql`
    mutation SubscribeToNotifications($input: SubscribeInput!) {
  subscribeToNotifications(input: $input)
}
    `;
export const UnsubscribeToNotificationsDocument = gql`
    mutation UnsubscribeToNotifications($input: UnsubscribeInput!) {
  unsubscribeToNotifications(input: $input)
}
    `;
export const SendNotificationDocument = gql`
    mutation SendNotification($input: NotificationInput!) {
  sendNotification(input: $input)
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    InAppNotifications(variables?: InAppNotificationsSubscriptionVariables, options?: C): AsyncIterable<InAppNotificationsSubscription> {
      return requester<InAppNotificationsSubscription, InAppNotificationsSubscriptionVariables>(InAppNotificationsDocument, variables, options) as AsyncIterable<InAppNotificationsSubscription>;
    },
    GetUserSubscriptions(variables?: GetUserSubscriptionsQueryVariables, options?: C): Promise<GetUserSubscriptionsQuery> {
      return requester<GetUserSubscriptionsQuery, GetUserSubscriptionsQueryVariables>(GetUserSubscriptionsDocument, variables, options) as Promise<GetUserSubscriptionsQuery>;
    },
    SubscribeToNotifications(variables: SubscribeToNotificationsMutationVariables, options?: C): Promise<SubscribeToNotificationsMutation> {
      return requester<SubscribeToNotificationsMutation, SubscribeToNotificationsMutationVariables>(SubscribeToNotificationsDocument, variables, options) as Promise<SubscribeToNotificationsMutation>;
    },
    UnsubscribeToNotifications(variables: UnsubscribeToNotificationsMutationVariables, options?: C): Promise<UnsubscribeToNotificationsMutation> {
      return requester<UnsubscribeToNotificationsMutation, UnsubscribeToNotificationsMutationVariables>(UnsubscribeToNotificationsDocument, variables, options) as Promise<UnsubscribeToNotificationsMutation>;
    },
    SendNotification(variables: SendNotificationMutationVariables, options?: C): Promise<SendNotificationMutation> {
      return requester<SendNotificationMutation, SendNotificationMutationVariables>(SendNotificationDocument, variables, options) as Promise<SendNotificationMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;