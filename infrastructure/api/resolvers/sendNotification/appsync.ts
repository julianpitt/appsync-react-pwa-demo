import { Sha256 } from '@aws-crypto/sha256-js';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { default as fetch, Request } from 'node-fetch';

export async function makeRequest(
  graphQLEndpoint: string,
  region: string,
  query: string,
  variables?: Record<string, any>,
) {
  const endpoint = new URL(graphQLEndpoint);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: region,
    service: 'appsync',
    sha256: Sha256,
  });

  const post_body = {
    query,
    variables,
  };

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify(post_body),
    path: endpoint.pathname,
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);

  const response = await fetch(request);
  return await response.json();
}
