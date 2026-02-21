import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import AnimatedBackground from '../components/AnimatedBackground';
import Section from '../components/Section';
import Title from '../components/Title';
import styles from './styles/Projects.scss';

const Projects: FC = () => {
  return (
    <div className="mt-auto mb-auto">
      <Section backgroundColor="primary-accent-color" flexCol>
        <Title fontFamily="Gugi" size="medium" center>
          <FormattedMessage
            id="Projects.title"
            defaultMessage="This Website:"
          />
        </Title>
        <div className={styles.content}>
          <FormattedMessage
            id="Projects.desc.1"
            defaultMessage="Checkout the code for this website! It's public on my Github. You can clone it and use it as a base or take something from it you like, doesn't matter to me!"
          />
        </div>
        <div className={styles.content}>
          <FormattedMessage
            id="Projects.desc.2"
            defaultMessage="This website uses: React, Typescript, Redux, SCSS and Tailwind"
          />
        </div>
        <a
          href="https://github.com/BenCaro8/CommercialWebsite"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center mx-auto my-6 text-white font-bold"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
            className="h-4 mr-1"
          />
          <FormattedMessage
            id="Projects.desc.3"
            defaultMessage="My Website's Github!"
          />
        </a>
      </Section>
      <AnimatedBackground />
    </div>
  );
};

export default Projects;
