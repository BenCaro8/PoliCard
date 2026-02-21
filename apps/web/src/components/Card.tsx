import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeColor } from '../utils/types';
import Title from './Title';
import styles from './styles/Card.scss';
import classNames from 'classnames';

type BackgroundColor = ThemeColor | 'white' | 'none';

type Props = {
  children?: ReactNode;
  title?: ReactNode;
  link?: string;
  imgSrc?: string;
  imgRight?: boolean;
  center?: boolean;
  color?: string;
  backgroundColor?: BackgroundColor;
  gradient?: BackgroundColor;
  borderColor?: ThemeColor | 'white';
  borderWidth?: number;
  borderRadius?: number;
};

const Card: FC<Props> = ({
  children,
  title,
  link = '',
  imgSrc,
  center = false,
  imgRight = false,
  color = 'white',
  backgroundColor: backgroundColorParam = 'none',
  gradient: gradientParam,
  borderColor,
  borderWidth = 3,
  borderRadius = 0,
}) => {
  let backgroundColor =
    !backgroundColorParam || backgroundColorParam === 'white'
      ? backgroundColorParam
      : `var(--${backgroundColorParam})`;

  if (gradientParam) {
    const gradient =
      gradientParam === 'white' ? gradientParam : `var(--${gradientParam})`;
    backgroundColor = `linear-gradient(45deg, ${backgroundColor}, ${gradient})`;
  }

  return (
    <>
      {!imgRight && imgSrc && (
        <img src={imgSrc} className={classNames(styles.pic, '-mr-5')} />
      )}
      <Link
        className={classNames(styles.cardWrapper, {
          [styles.cardWithPic]: imgSrc,
          [styles.cardWithoutPic]: !imgSrc,
          [styles.noLink]: !link,
        })}
        style={{
          color,
          background: backgroundColor,
          borderColor:
            borderColor === 'white' ? borderColor : `var(--${borderColor})`,
          borderWidth: `${borderWidth}px`,
          borderRadius: `${borderRadius}px`,
        }}
        to={link}
      >
        <div
          className={classNames(styles.content, {
            [styles.center]: center,
          })}
        >
          {title && (
            <>
              <Title size="medium" center>
                {title}
              </Title>
              <div
                className={styles.divisionBar}
                style={{ backgroundColor: color }}
              />
            </>
          )}
          {children}
        </div>
      </Link>
      {imgRight && imgSrc && (
        <img src={imgSrc} className={classNames(styles.pic, '-ml-5')} />
      )}
    </>
  );
};

export default Card;
