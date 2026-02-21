import { FC, useEffect, useRef } from 'react';
import useInstall from '../hooks/useInstall';
import styles from './styles/Installer.scss';
import classNames from 'classnames';

const Installer: FC = () => {
  const { outputLogs, isInstalling, install } = useInstall();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputLogs]);

  return (
    <div className={styles.content}>
      <div className={styles.logBox}>
        {outputLogs.map((log, index) => (
          <div
            key={index}
            className={classNames(styles.logRow, {
              [styles.logRowAltColor]: index % 2 === 0,
            })}
          >
            {log}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <button
        className={classNames(styles.installButton, {
          [styles.installButtonLoading]: isInstalling,
        })}
        onClick={install}
        disabled={isInstalling}
      >
        {isInstalling ? 'Installing...' : 'Install'}
      </button>
    </div>
  );
};

export default Installer;
