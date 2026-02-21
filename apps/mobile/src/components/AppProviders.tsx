import { FC, ReactNode, useEffect, useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../utils/apollo';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import store, { persistor } from '../utils/store';

type Props = {
  children: ReactNode;
};

const messages = {
  en: () => import('../../locales/en.json'),
  es: () => import('../../locales/es.json'),
};

const getLocaleMessages = async (locale: string) => {
  try {
    return (await messages[locale as keyof typeof messages]()).default;
  } catch {
    // Fallback to English if the locale file isn’t found
    return (await messages['en']()).default;
  }
};

const isDevelopment = process.env.EXPO_PUBLIC_NODE_ENV === 'development';

const AppProviders: FC<Props> = ({ children }) => {
  // TODO: When nationalization is implemented and translations kept up with, insert locale.
  // const locale = navigator.language.split('-')[0] || 'en';
  const locale = 'en';

  const [localeMessages, setLocaleMessages] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!isDevelopment) getLocaleMessages(locale).then(setLocaleMessages);
  }, [locale]);

  if (!localeMessages) return;

  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IntlProvider
            locale={locale}
            messages={localeMessages}
            defaultLocale="en"
          >
            {children}
          </IntlProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

export default AppProviders;
