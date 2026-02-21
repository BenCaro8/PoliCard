import { ApolloClient, InMemoryCache, ApolloLink, split } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { createHttpLink } from '@apollo/client/link/http';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:8080/graphql',
  }),
);

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

// Split based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([retryLink, splitLink]),
  cache: new InMemoryCache(),
});
