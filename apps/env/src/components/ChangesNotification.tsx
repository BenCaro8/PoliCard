import { FC } from 'react';
import styles from './styles/ChangesNotification.scss';

const ChangesNotification: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <div className={styles.notification}>
        <span className={styles.message}>Changes need to be applied!</span>
      </div>
    </div>
  );
};

export default ChangesNotification;
