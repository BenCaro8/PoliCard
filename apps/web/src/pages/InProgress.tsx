import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import AnimatedBackground from '../components/AnimatedBackground';
import Section from '../components/Section';
import styles from './styles/InProgress.scss';

const InProgress: FC = () => {
  return (
    <div className="mt-auto mb-auto">
      <Section backgroundColor="primary-accent-color" center flexCol>
        <div className={styles.title}>
          <span>
            <FormattedMessage
              id="InProgress.title"
              defaultMessage="In Progress"
            />
          </span>
        </div>
      </Section>
      <AnimatedBackground />
    </div>
  );
};

export default InProgress;
