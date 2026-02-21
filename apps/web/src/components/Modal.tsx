import { FC, ReactNode } from 'react';
import styles from './styles/Modal.scss';
import classNames from 'classnames';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  size?: 'large' | 'medium' | 'small';
  children?: ReactNode;
};

const Modal: FC<Props> = ({ isOpen, onClose, size = 'medium', children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={classNames(styles.modalContentWrapper, {
          [styles.modalLarge]: size === 'large',
          [styles.modalMedium]: size === 'medium',
          [styles.modalSmall]: size === 'small',
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
