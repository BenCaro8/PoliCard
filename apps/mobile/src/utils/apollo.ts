import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { RetryLink } from '@apollo/client/link/retry';
import { onError } from '@apollo/client/link/error';
import { router } from 'expo-router';

const GRAPHQL_URI = process.env.EXPO_PUBLIC_SERVER_URI;

if (!GRAPHQL_URI) {
  console.error('Environment variable for GRAPHQL_URI nor set!');
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  let skipPrinting = false;
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (
        message === 'Unauthorized' ||
        message === 'Access Token has been revoked'
      ) {
        skipPrinting = true;
        router.replace('/logout');
      }

      if (!skipPrinting)
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
    });
  }
  if (networkError && !skipPrinting) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export class ReactNativeFile {
  uri: string;
  type: string;
  name: string;
  constructor({
    uri,
    type,
    name,
  }: {
    uri: string;
    type: string;
    name: string;
  }) {
    this.uri = uri;
    this.type = type;
    this.name = name;
  }
}

const isReactNativeFile = (value: unknown) => value instanceof ReactNativeFile;

const uploadLink = createUploadLink({
  uri: `${GRAPHQL_URI}/graphql`,
  credentials: 'include', // Ensures cookies are sent if needed
  headers: {
    'apollo-require-preflight': 'true',
  },
  isExtractableFile: isReactNativeFile,
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: Infinity,
    retryIf: (error) => !!error,
  },
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    retryLink,
    // apollo-upload-client is no longer updated, still seems to work
    uploadLink as unknown as ApolloLink,
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Node: {
        keyFields: ['nodeId'],
      },
    },
  }),
});
