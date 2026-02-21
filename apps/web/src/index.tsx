import { createRoot } from 'react-dom/client';
import AppProviders from './AppProviders';
import App from './App';

import './styles/index.css';

const container = document.getElementById('root');

// Only non-null assertion as It'll always exist
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <AppProviders>
    <App />
  </AppProviders>,
);
