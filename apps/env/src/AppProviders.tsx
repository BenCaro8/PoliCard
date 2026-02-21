import { FC, ReactNode } from 'react';
import { apolloClient } from './utils/apollo';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import store from './utils/store';

type Props = {
  children: ReactNode;
};

const AppProviders: FC<Props> = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>{children}</Provider>
    </ApolloProvider>
  );
};

export default AppProviders;
