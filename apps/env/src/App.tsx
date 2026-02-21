import { FC, useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import AppProviders from './AppProviders';
import TitleBar from './components/TitleBar';
import AltEnv from './pages/AltEnv';
import Installer from './pages/Installer';
import styles from './styles/App.scss';

const App: FC = () => {
  const [hasInstalled, setHasInstalled] = useState<boolean>();

  useEffect(() => {
    const isInstalled = localStorage.getItem('hasInstalled') === 'true';
    setHasInstalled(isInstalled);
  }, []);

  const appContent = useMemo(() => {
    if (hasInstalled === undefined) {
      return (
        <div className={styles.spinnerContainer}>
          <div className={styles.loadingSpinner} />
        </div>
      );
    }
    return hasInstalled ? <AltEnv /> : <Installer />;
  }, [hasInstalled]);

  return (
    <div className={styles.application}>
      <TitleBar />
      {appContent}
    </div>
  );
};

const root = createRoot(document.body);
root.render(
  <AppProviders>
    <App />
  </AppProviders>,
);
