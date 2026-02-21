import { FC } from 'react';
import { useAppSelector } from '../utils/store';
import styles from './styles/ConnectionIndicator.scss';
import classNames from 'classnames';
import { ConnectionStatus } from '@graphql';

const ConnectionIndicator: FC = () => {
  const connectionStatus = useAppSelector(
    (state) => state.proxy.connectionStatus,
  );

  return (
    <div
      className={classNames(styles.container, {
        [styles.connected]: connectionStatus === ConnectionStatus.Connected,
        [styles.disconnected]:
          connectionStatus === ConnectionStatus.Disconnected,
        [styles.connecting]: connectionStatus === ConnectionStatus.Connecting,
      })}
    >
      <div className={styles.statusIcon} />
      {connectionStatus.toLowerCase()}
    </div>
  );
};

export default ConnectionIndicator;
