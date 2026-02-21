import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import AnimatedBackground from '../components/AnimatedBackground';
import Section from '../components/Section';
import Title from '../components/Title';
import styles from './styles/Resume.scss';

const Resume: FC = () => {
  return (
    <>
      <Section backgroundColor="primary-accent-color" center>
        <a href="/public/Resume.pdf" download>
          <Title fontFamily="Gugi" size="medium" center>
            <FormattedMessage
              id="Resume.download"
              defaultMessage="Download Resume as PDF"
            />
          </Title>
        </a>
      </Section>
      <Section center showAnimatedBackground>
        <img src="/public/Resume.jpg" className={styles.resume} />
      </Section>
      <AnimatedBackground />
    </>
  );
};

export default Resume;
