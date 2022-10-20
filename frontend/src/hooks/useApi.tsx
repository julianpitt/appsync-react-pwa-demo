import { GraphQLOptions, GraphQLResult } from '@aws-amplify/api-graphql';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/auth';
import { API, Auth } from 'aws-amplify';
import { getSdk, Requester } from '../api/graphql';
import { DocumentNode } from 'graphql';

const validDocDefOps = ['mutation', 'query', 'subscription'];

export function useApi() {
  const requester: Requester = async <R, V>(
    doc: DocumentNode,
    variables?: V,
    overwrites?: Partial<GraphQLOptions>,
  ): Promise<R> => {
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

    await Auth.currentCredentials()
      .then(d => console.log('data: ', d))
      .catch(e => console.log('error: ', e));

    switch (definition.operation) {
      case 'query': {
        const response = (await API.graphql<R>({
          query: doc as GraphQLOptions['query'],
          variables: variables as object,
          authMode: GRAPHQL_AUTH_MODE.AWS_IAM,
          ...overwrites,
        })) as GraphQLResult<R>;

        if (response.errors) {
          console.error(response.errors);
          throw new Error('Api call failed');
        }

        if (response.data === undefined || response.data === null) {
          throw new Error('No data presented in the GraphQL response');
        }

        return response.data;
      }
      default:
        throw new Error(`Unsupported operation ${definition.operation}`);
    }
  };

  return getSdk(requester);
}
