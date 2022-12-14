import { GraphQLOptions, GraphQLResult } from '@aws-amplify/api-graphql';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/auth';
import { API, Auth } from 'aws-amplify';
import { getSdk, Requester } from '../api/graphql';
import { DocumentNode } from 'graphql';
import { toast } from 'react-toastify';
import Observable from 'zen-observable-ts';
import { AWSAppSyncRealTimeProvider } from '@aws-amplify/pubsub';

const validDocDefOps = ['mutation', 'query', 'subscription'];

export function useApi() {

  const requester = async <R, V>(
    doc: DocumentNode,
    variables?: V,
    overwrites?: Partial<GraphQLOptions>,
  ): Promise<R | Observable<{
    provider: AWSAppSyncRealTimeProvider;
    value: GraphQLResult<R>;
  }>> => {
    // Valid document should contain *single* query or mutation unless it's has a fragment
    if (
      doc.definitions.filter(
        d => d.kind === 'OperationDefinition' && validDocDefOps.includes(d.operation),
      ).length !== 1
    ) {
      throw new Error('DocumentNode passed to AppSync must contain single query or mutation');
    }

    const definition = doc.definitions[0];

    // Valid document should contain *OperationDefinition*
    if (definition.kind !== 'OperationDefinition') {
      throw new Error('DocumentNode passed to AppSync must contain single query or mutation');
    }

    const creds = await Auth.currentSession();

    switch (definition.operation) {
      case 'mutation': 
      case 'query': {
        const response = (await API.graphql<R>({
          query: doc as GraphQLOptions['query'],
          variables: variables as object,
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
          ...overwrites,
        }, {
          Authorization: creds.getIdToken().getJwtToken()
        })) as GraphQLResult<R>;

        if (response.errors) {
          console.error(response.errors);
          toast('Api call failed', {type: 'error'});
          throw new Error('Api call failed');
        }

        if (response.data === undefined || response.data === null) {
          toast('Api call failed', {type: 'error'});
          throw new Error('No data presented in the GraphQL response');
        }

        return response.data;
      }
      case 'subscription': {
        const response = API.graphql<R>({
          query: doc as GraphQLOptions['query'],
          variables: variables as object,
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
          ...overwrites,
        }, {
          Authorization: creds.getIdToken().getJwtToken()
        }) as Observable<{
          provider: AWSAppSyncRealTimeProvider;
          value: GraphQLResult<R>;
        }>;

        return response;
      }
      default:
        throw new Error(`Unsupported operation ${definition.operation}`);
    }
  };

  return getSdk(requester as Requester);
}
