import { FC, RefObject, useState } from 'react';
import { Environment } from '../utils/slices/proxy';
import styles from './styles/SelectionCarousel.scss';
import classNames from 'classnames';

type Props = {
  environments: Environment[];
  currentIndex: number;
  ref: RefObject<HTMLDivElement>;
  tabIndex?: number;
  disabled?: boolean;
  hasChanges?: boolean;
  setCurrentIndex: (index: number) => void;
};

const SelectionCarousel: FC<Props> = ({
  environments,
  currentIndex,
  ref,
  tabIndex,
  disabled = false,
  hasChanges = false,
  setCurrentIndex,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentEnvironment = environments[currentIndex];

  const handleClick = () => {
    if (disabled) return;

    if (isFocused) {
      setCurrentIndex((currentIndex + 1) % environments.length);
    }
    ref.current?.focus();
  };

  return (
    <div
      ref={ref}
      className={classNames(styles.carousel, {
        [styles.focused]: isFocused,
        [styles.disabled]: disabled,
        [styles.hasChanges]: hasChanges,
      })}
      tabIndex={tabIndex || 0}
      onClick={handleClick}
      onFocus={() => {
        const element = ref as React.RefObject<HTMLDivElement>;
        element.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
        setIsFocused(true);
      }}
      onBlur={() => setIsFocused(false)}
    >
      <div className={styles.carouselHeader}>Remote Target:</div>
      <div className={styles.environmentDisplay}>
        <div className={styles.environmentName}>{currentEnvironment.name}</div>
        <div className={styles.environmentUrl}>
          {currentEnvironment.kubeContext}
        </div>
      </div>
    </div>
  );
};

export default SelectionCarousel;
