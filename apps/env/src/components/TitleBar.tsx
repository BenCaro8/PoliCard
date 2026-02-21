import { FC } from 'react';
import ConnectionIndicator from './ConnectionIndicator';
import styles from './styles/TitleBar.scss';

const TitleBar: FC = () => {
  return (
    <div className={styles.titlebar}>
      <div className={styles.content}>
        <div className={styles.title}>ALT-ENV</div>
        <ConnectionIndicator />
      </div>
      <div className={styles.altBand} />
    </div>
  );
};

export default TitleBar;
