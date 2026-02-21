import { FC, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import NavBar from './components/NavBar';
import NavBarMobile from './components/mobile/NavBarMobile';
import Footer from './components/Footer';
import { useAppSelector, useAppDispatch } from './store';
import {
  setIsMobile,
  setDefaultColors,
  setInitialTheme,
} from './slices/settings';
import { navOptions } from './utils/types';
import styles from './styles/App.scss';

const Home = lazy(() => import('./pages/Home'));
const Resume = lazy(() => import('./pages/Resume'));
const Themes = lazy(() => import('./pages/Themes'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Login = lazy(() => import('./pages/Login'));
const Three = lazy(() => import('./components/Three'));

const App: FC = () => {
  const isMobile = useAppSelector((state) => state.settings.isMobile);
  const dispatch = useAppDispatch();

  const handleWindowSizeChange = () => {
    const newSizeIsMobile = window.innerWidth <= 959;
    if (isMobile != newSizeIsMobile) {
      dispatch(setIsMobile(newSizeIsMobile));
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, [isMobile]);

  useEffect(() => {
    dispatch(setDefaultColors());
    dispatch(setInitialTheme());
  }, []);

  const NavBarComponent = isMobile ? (
    <NavBarMobile options={navOptions} />
  ) : (
    <NavBar options={navOptions} />
  );

  return (
    <BrowserRouter basename="/">
      <div className={styles.appContainer}>
        {NavBarComponent}
        <Suspense
          fallback={
            <FormattedMessage
              id="App.pageLoading"
              defaultMessage="Page is Loading..."
            />
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/three" element={<Three />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
