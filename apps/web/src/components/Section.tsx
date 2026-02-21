import { FC, ReactNode } from 'react';
import { ThemeColor } from '../utils/types';
import classNames from 'classnames';
import styles from './styles/Section.scss';

type BackgroundColor = ThemeColor | 'white' | 'none';

type Props = {
  children?: ReactNode;
  backgroundColor?: BackgroundColor;
  gradient?: BackgroundColor;
  height?: number;
  zIndex?: number;
  style?: string;
  center?: boolean;
  flexCol?: boolean;
  showAnimatedBackground?: boolean;
  divisionBar?: boolean;
};

const Section: FC<Props> = ({
  children,
  backgroundColor: backgroundColorParam = 'primary-bg-color',
  gradient: gradientParam,
  height: heightParam,
  zIndex = 10,
  style = '',
  center = false,
  flexCol = false,
  showAnimatedBackground = false,
  divisionBar = false,
}) => {
  const height = heightParam ? `${heightParam}px` : 'fit-content';

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
      <section
        className={classNames({
          [style]: !!style,
          [styles.section]: !style,
        })}
        style={{
          height,
          background: backgroundColor,
          zIndex: showAnimatedBackground ? 'auto' : zIndex,
        }}
      >
        <div
          className={classNames(styles.contentWrapper, {
            'place-content-center items-center': center,
            'flex-col': flexCol,
          })}
        >
          {children}
        </div>
      </section>
      {divisionBar && <div className={styles.divisionBar} />}
    </>
  );
};

export default Section;
