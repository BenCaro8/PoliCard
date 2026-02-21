import { FC, useRef, useState } from 'react';
import marioBlockGif from '../../assets/mario-block.gif';
import styles from './styles/ServiceRow.scss';
import classNames from 'classnames';

type Color = 'green' | 'yellow' | 'red' | 'blue';

type Props = {
  name: string;
  isLocal: boolean;
  onToggle: () => void;
  isApplied: boolean;
  disabled?: boolean;
  tabIndex?: number;
};

const ServiceRow: FC<Props> = ({
  name,
  isLocal,
  onToggle,
  isApplied,
  disabled = false,
  tabIndex,
}) => {
  const colorRef = useRef<Color>('blue');
  const selfRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      event.key === ' ' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) {
        onToggle();
      }
    }
  };

  const RemoteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 9l2 2c2.88-2.88 7.12-2.88 10 0l2-2C11.12 5.12 4.88 5.12 1 9z" />
      <path d="M3 13l2 2c1.38-1.38 3.62-1.38 5 0l2-2c-2.12-2.12-5.88-2.12-8 0z" />
      <path d="M5 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z" />
    </svg>
  );

  return (
    <div
      ref={selfRef}
      className={classNames(styles.serviceRow, {
        [styles.focused]: isFocused,
        [styles.disabled]: disabled,
      })}
      style={{ borderColor: colorRef.current }}
      tabIndex={disabled ? -1 : tabIndex}
      onKeyDown={handleKeyDown}
      role="button"
      onClick={() => {
        selfRef.current?.focus();
        setIsFocused(true);
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={`${name} service - ${isLocal ? 'Local' : 'Remote'} mode`}
    >
      <div className={styles.serviceName}>{name}</div>
      {!isApplied && (
        <>
          <img className={styles.marioIcon} src={marioBlockGif} />
          <img className={styles.marioIcon} src={marioBlockGif} />
          <img className={styles.marioIcon} src={marioBlockGif} />
        </>
      )}
      <div className={styles.toggleSection}>
        <div
          className={classNames(styles.slideIndicator, {
            [styles.slideToRemote]: !isLocal,
            [styles.slideToLocal]: isLocal,
          })}
        />
        <div
          className={classNames(styles.toggleCell, styles.localCell, {
            [styles.active]: isLocal,
            [styles.disabled]: disabled,
          })}
          onClick={!disabled && !isLocal ? onToggle : undefined}
        >
          <span className={styles.cellLabel}>Local</span>
        </div>
        <div
          className={classNames(styles.toggleCell, styles.remoteCell, {
            [styles.active]: !isLocal,
            [styles.disabled]: disabled,
          })}
          onClick={!disabled && isLocal ? onToggle : undefined}
        >
          <RemoteIcon />
          <span className={styles.cellLabel}>Remote</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceRow;
