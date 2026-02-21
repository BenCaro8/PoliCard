import { FC, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Section from '../Section';
import Drawer from './Drawer';
import Title from '../Title';
import { NavOption } from '../../utils/types';
import styles from './styles/NavBarMobile.scss';
import classNames from 'classnames';

type Props = {
  options: NavOption[];
};

const NavBarMobile: FC<Props> = ({ options }) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [topOfPage, setTopOfPage] = useState(window.scrollY === 0);
  const navBarHeight = 50;

  useEffect(() => {
    window.onscroll = () => setTopOfPage(window.scrollY < 20);

    let touchstartX = 0;
    let touchendX = 0;

    const checkSwipe = () => {
      if (touchendX > touchstartX && touchendX - touchstartX > 100) {
        setIsOpen(true);
      }
      if (touchendX < touchstartX && touchstartX - touchendX > 100) {
        setIsOpen(false);
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('touchstart', (e) => {
      touchstartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
      touchendX = e.changedTouches[0].screenX;
      checkSwipe();
    });
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Section
        style={classNames(styles.navContainer, 'text-white content-center', {
          [styles.navBoxShadow]: !topOfPage,
        })}
        height={navBarHeight}
        zIndex={100}
      >
        <button className={styles.hamburger} onClick={toggleMenu}>
          ☰
        </button>
        <Link className={styles.rightCenter} to="/">
          <Title size="small">Ben-Caro.com</Title>
        </Link>
      </Section>
      <Section height={navBarHeight} />
      <Drawer
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setIsSettingsOpen(false);
        }}
      >
        {options.map((option, index) => {
          return (
            <Link
              key={index}
              className={styles.drawerOption}
              onClick={() => setIsOpen(false)}
              to={option.route}
            >
              {intl.formatMessage(option.label)}
              <svg viewBox="0 0 24 24" height="20px" width="20px">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
                  fill="var(--primary-accent-color)"
                />
              </svg>
            </Link>
          );
        })}
        <div
          className={classNames(styles.settingsWrapper, {
            [styles.closed]: !isSettingsOpen,
          })}
        >
          <a
            className={styles.settingsNavLink}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <svg
              className={styles.settingsCog}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 54 54"
            >
              <path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571   c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571   c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78   C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571   c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571   c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052   c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966   c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42   c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052   c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553   c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114   S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22   C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571   c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854   c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052   c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572   c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294   C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052   c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553   c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78   C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64   c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104   l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z" />
              <path d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7   s7,3.141,7,7S30.859,34,27,34z" />
            </svg>
            <FormattedMessage
              id="NavBarMobile.settings"
              defaultMessage="Settings"
            />
            <div className={styles.rightCenter}>
              <svg
                viewBox="0 0 24 24"
                className={classNames(styles.caret, {
                  [styles.rotate]: !isSettingsOpen,
                })}
              >
                <path
                  d="M5.16108 10.0731C4.45387 9.2649 5.02785 8 6.1018 8H17.898C18.972 8 19.5459 9.2649 18.8388 10.0731L13.3169 16.3838C12.6197 17.1806 11.3801 17.1806 10.6829 16.3838L5.16108 10.0731ZM6.65274 9.5L11.8118 15.396C11.9114 15.5099 12.0885 15.5099 12.1881 15.396L17.3471 9.5H6.65274Z"
                  fill="#212121"
                />
              </svg>
            </div>
          </a>
          <Link
            className={styles.drawerOption}
            onClick={() => {
              setIsOpen(false);
              setIsSettingsOpen(false);
            }}
            to="/themes"
          >
            <FormattedMessage
              id="NavBarMobile.themes"
              defaultMessage="Themes"
            />
            <svg viewBox="0 0 24 24" height="20px" width="20px">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z"
                fill="var(--primary-accent-color)"
              />
            </svg>
          </Link>
        </div>
      </Drawer>
    </>
  );
};

export default NavBarMobile;
