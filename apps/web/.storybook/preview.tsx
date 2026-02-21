import React from 'react';
import type { Preview } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import AppProviders from '../src/AppProviders';

import '../src/styles/index.css';

// @ts-ignore
window.$RefreshReg$ = () => {};
// @ts-ignore
window.$RefreshSig$ = () => () => {};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      return (
        <AppProviders>
          <BrowserRouter basename="/">
            <Story />
          </BrowserRouter>
        </AppProviders>
      );
    },
  ],
};

export default preview;
