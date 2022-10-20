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
  ActionStatus: ResolverTypeWrapper<ActionStatus>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Mutation: ResolverTypeWrapper<{}>;
  NotificationInput: NotificationInput;
  Query: ResolverTypeWrapper<{}>;
  Status: Status;
  String: ResolverTypeWrapper<Scalars['String']>;
  SubscribeInput: SubscribeInput;
  SubscriptionStatus: ResolverTypeWrapper<SubscriptionStatus>;
  SubscriptionStatusInput: SubscriptionStatusInput;
  UnsubscribeInput: UnsubscribeInput;
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
  ActionStatus: ActionStatus;
  Boolean: Scalars['Boolean'];
  Mutation: {};
  NotificationInput: NotificationInput;
  Query: {};
  String: Scalars['String'];
  SubscribeInput: SubscribeInput;
  SubscriptionStatus: SubscriptionStatus;
  SubscriptionStatusInput: SubscriptionStatusInput;
  UnsubscribeInput: UnsubscribeInput;
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

export type ActionStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActionStatus'] = ResolversParentTypes['ActionStatus']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  sendNotification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendNotificationArgs, 'input'>>;
  subscribeToNotifications?: Resolver<ResolversTypes['ActionStatus'], ParentType, ContextType, RequireFields<MutationSubscribeToNotificationsArgs, 'input'>>;
  unsubscribeToNotifications?: Resolver<ResolversTypes['ActionStatus'], ParentType, ContextType, RequireFields<MutationUnsubscribeToNotificationsArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getSubscriptionStatus?: Resolver<ResolversTypes['SubscriptionStatus'], ParentType, ContextType, Partial<QueryGetSubscriptionStatusArgs>>;
};

export type SubscriptionStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionStatus'] = ResolversParentTypes['SubscriptionStatus']> = {
  subscribed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
  ActionStatus?: ActionStatusResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SubscriptionStatus?: SubscriptionStatusResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  aws_cognito_user_pools?: AwsCognitoUserPoolsDirectiveResolver<any, any, ContextType>;
  aws_iam?: AwsIamDirectiveResolver<any, any, ContextType>;
};


export const GetSubscriptionStatusDocument = gql`
    query GetSubscriptionStatus($input: SubscriptionStatusInput!) {
  getSubscriptionStatus(input: $input) {
    subscribed
  }
}
    `;
export const SubscribeToNotificationsDocument = gql`
    mutation SubscribeToNotifications($input: SubscribeInput!) {
  subscribeToNotifications(input: $input) {
    status
    message
  }
}
    `;
export const UnubscribeToNotificationsDocument = gql`
    mutation UnubscribeToNotifications($input: UnsubscribeInput!) {
  unsubscribeToNotifications(input: $input) {
    status
    message
  }
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
    GetSubscriptionStatus(variables: GetSubscriptionStatusQueryVariables, options?: C): Promise<GetSubscriptionStatusQuery> {
      return requester<GetSubscriptionStatusQuery, GetSubscriptionStatusQueryVariables>(GetSubscriptionStatusDocument, variables, options) as Promise<GetSubscriptionStatusQuery>;
    },
    SubscribeToNotifications(variables: SubscribeToNotificationsMutationVariables, options?: C): Promise<SubscribeToNotificationsMutation> {
      return requester<SubscribeToNotificationsMutation, SubscribeToNotificationsMutationVariables>(SubscribeToNotificationsDocument, variables, options) as Promise<SubscribeToNotificationsMutation>;
    },
    UnubscribeToNotifications(variables: UnubscribeToNotificationsMutationVariables, options?: C): Promise<UnubscribeToNotificationsMutation> {
      return requester<UnubscribeToNotificationsMutation, UnubscribeToNotificationsMutationVariables>(UnubscribeToNotificationsDocument, variables, options) as Promise<UnubscribeToNotificationsMutation>;
    },
    SendNotification(variables: SendNotificationMutationVariables, options?: C): Promise<SendNotificationMutation> {
      return requester<SendNotificationMutation, SendNotificationMutationVariables>(SendNotificationDocument, variables, options) as Promise<SendNotificationMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;