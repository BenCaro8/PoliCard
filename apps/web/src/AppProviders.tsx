import { FC, ReactNode, useEffect, useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from '@apollo/client';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import store from './store';

type Props = {
  children: ReactNode;
};

const messages = {
  en: () => import('../locales/en.json'),
  es: () => import('../locales/es.json'),
};

const getLocaleMessages = async (locale: string) => {
  try {
    return (await messages[locale as keyof typeof messages]()).default;
  } catch {
    // Fallback to English if the locale file isn’t found
    return (await messages['en']()).default;
  }
};

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include', // Include cookies in requests
  }),
  cache: new InMemoryCache(),
});

const AppProviders: FC<Props> = ({ children }) => {
  // TODO: When nationalization is implemented and translations kept up with, insert locale.
  // const locale = navigator.language.split('-')[0] || 'en';
  const locale = 'en';

  const [localeMessages, setLocaleMessages] =
    useState<Record<string, string>>();

  useEffect(() => {
    getLocaleMessages(locale).then(setLocaleMessages);
  }, [locale]);

  if (!localeMessages) return;

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <IntlProvider
          locale={locale}
          messages={localeMessages}
          defaultLocale="en"
        >
          {children}
        </IntlProvider>
      </ApolloProvider>
    </Provider>
  );
};

export default AppProviders;
