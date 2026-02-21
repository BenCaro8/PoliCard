import { FC, ReactNode } from 'react';
import { ThemeColor } from '../utils/types';
import styles from './styles/Title.scss';
import classNames from 'classnames';

type Props = {
  children?: ReactNode;
  color?: string;
  center?: boolean;
  noMargin?: boolean;
  backgroundColor?: ThemeColor | 'white';
  size?: 'large' | 'medium' | 'small';
  fontFamily?: string;
};

const Title: FC<Props> = ({
  children,
  color: colorParam = 'white',
  center = false,
  noMargin = false,
  backgroundColor,
  size = 'large',
  fontFamily = 'Arial, Helvetica, sans-serif',
}) => {
  const color =
    !colorParam || colorParam === 'white' ? colorParam : `var(--${colorParam})`;

  return (
    <div
      className={classNames(styles.title, {
        [styles.titleLarge]: size === 'large',
        [styles.titleMedium]: size === 'medium',
        [styles.titleSmall]: size === 'small',
        [styles.noMargin]: noMargin,
        [styles.center]: center,
      })}
      style={{
        fontFamily,
        color,
        backgroundColor:
          backgroundColor === 'white'
            ? backgroundColor
            : `var(--${backgroundColor})`,
      }}
    >
      <span
        className={classNames({
          [styles.center]: center,
        })}
      >
        {children}
      </span>
    </div>
  );
};

export default Title;
