import { FC, ReactNode } from 'react';
import styles from './styles/Button.scss';
import classNames from 'classnames';

type Props = {
  children: ReactNode;
  handleClick: () => void;
  disabled?: boolean;
  right?: boolean;
};

const Button: FC<Props> = ({ children, handleClick, disabled, right }) => {
  return (
    <button
      onClick={handleClick}
      className={classNames(styles.button, {
        [styles.enabledButton]: !disabled,
        [styles.disabledButton]: disabled,
        [styles.right]: right,
      })}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
