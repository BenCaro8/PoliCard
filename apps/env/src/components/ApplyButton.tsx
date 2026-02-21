import { FC, Ref, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../utils/store';
import { useMutation } from '@apollo/client';
import styles from './styles/ApplyButton.scss';
import classNames from 'classnames';
import { gql } from '@gql';

type Props = {
  ref: Ref<HTMLButtonElement>;
  isApplying: boolean;
  onApply: () => void;
  tabIndex?: number;
  disabled?: boolean;
};

const ATTEMPT_RECONNECT = gql(`
  mutation AttemptReconnect {
    attemptReconnect
  }
`);

const ApplyButton: FC<Props> = ({
  ref,
  isApplying,
  onApply,
  tabIndex,
  disabled = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [attemptReconnect, { loading }] = useMutation(ATTEMPT_RECONNECT);
  const connectionStatus = useAppSelector(
    (state) => state.proxy.connectionStatus,
  );

  useEffect(() => {
    if (isApplying || loading) {
      setIsFocused(false);
    }
  }, [isApplying, loading]);

  const label = useMemo(() => {
    if (connectionStatus === 'DISCONNECTED') {
      return 'Attempt Reconnect';
    } else if (loading) {
      return 'Reconnecting...';
    } else if (isApplying) {
      return 'Applying...';
    }
    return 'Apply Configuration';
  }, [connectionStatus, isApplying, loading]);

  return (
    <button
      ref={ref}
      className={classNames(styles.applyButton, {
        [styles.focused]: isFocused,
      })}
      onClick={() => {
        connectionStatus === 'DISCONNECTED' ? attemptReconnect() : onApply();
      }}
      disabled={(isApplying || disabled) && connectionStatus !== 'DISCONNECTED'}
      tabIndex={tabIndex}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {isApplying && <div className={styles.loadingSpinner} />}
      {label}
    </button>
  );
};

export default ApplyButton;
