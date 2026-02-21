import { FC, useState, useEffect } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import Title from './Title';
import styles from './styles/TypingAnimation.scss';

type Props = {
  message: MessageDescriptor;
  delay?: number;
};

const TypingAnimation: FC<Props> = ({ message, delay = 150 }) => {
  const intl = useIntl();
  const [currIndex, setCurrIndex] = useState(0);
  const [displayCursor, setDisplayCursor] = useState(true);

  const getDelay = () => {
    const addition = Math.floor(Math.random() * 2) === 0;
    const deviation = Math.floor(Math.random() * Math.floor(delay * 0.7));
    return addition ? delay + deviation : delay - deviation;
  };

  const text = intl.formatMessage(message);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (currIndex <= text.length) {
      timeout = setTimeout(() => {
        setCurrIndex((prevIndex) => prevIndex + 1);
      }, getDelay());
    } else {
      timeout = setTimeout(() => {
        setDisplayCursor(false);
      }, 2500);
    }

    return () => clearTimeout(timeout);
  }, [currIndex]);

  return (
    <Title fontFamily="Gugi" size="large" center>
      {text.slice(0, currIndex)}
      {displayCursor && <div className={styles.typingCursor} />}
    </Title>
  );
};

export default TypingAnimation;
