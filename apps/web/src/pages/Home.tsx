import { FC } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import AnimatedBackground from '../components/AnimatedBackground';
import Section from '../components/Section';
import Card from '../components/Card';
import TypingAnimation from '../components/TypingAnimation';
import styles from './styles/Home.scss';

const Home: FC = () => {
  return (
    <>
      <Section backgroundColor="primary-accent-color">
        <TypingAnimation
          message={defineMessage({
            id: 'Home.typingAnimation',
            defaultMessage: 'Ben Caro: Software Engineer',
          })}
        />
        <img src="/public/self.png" className={styles.selfie} />
      </Section>
      <div className="mt-auto mb-auto">
        <Section style="py-5" center showAnimatedBackground flexCol>
          <Card
            center
            title={
              <FormattedMessage id="Home.about" defaultMessage="About Me" />
            }
            borderWidth={0}
            borderRadius={10}
            backgroundColor="secondary-accent-color"
            gradient="primary-gradient-color"
            link="/about"
          >
            <p>
              <FormattedMessage
                id="Home.about.desc"
                defaultMessage="Learn about me, my interests and professional experience!"
              />
            </p>
          </Card>
          <Card
            center
            title={
              <FormattedMessage id="Home.resume" defaultMessage="My Resume" />
            }
            borderWidth={0}
            borderRadius={10}
            backgroundColor="secondary-accent-color"
            link="/resume"
          >
            <p>
              <FormattedMessage
                id="Home.resume.desc"
                defaultMessage="My resume for anyone interested in what I've done professionally in a concise format."
              />
            </p>
          </Card>
          <Card
            center
            title={
              <FormattedMessage id="Home.projects" defaultMessage="Projects" />
            }
            borderWidth={0}
            borderRadius={10}
            backgroundColor="primary-gradient-color"
            gradient="secondary-accent-color"
            link="/projects"
          >
            <p>
              <FormattedMessage
                id="Home.projects.desc"
                defaultMessage="Take a look at the projects that I've done and am currently working on."
              />
            </p>
          </Card>
          <Card
            center
            title={
              <FormattedMessage id="Home.themes" defaultMessage="Themes" />
            }
            borderWidth={0}
            borderRadius={10}
            backgroundColor="primary-accent-color"
            link="/themes"
          >
            <p>
              <FormattedMessage
                id="Home.themes.desc"
                defaultMessage="Change the look of this website by playing around with the themes."
              />
            </p>
          </Card>
        </Section>
      </div>
      <AnimatedBackground />
    </>
  );
};

export default Home;
