import { ReactNode } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';

export const ROUTE_HOME = '/' as const;
export const ROUTE_ABOUT = '/about' as const;
export const ROUTE_RESUME = '/resume' as const;
export const ROUTE_PROJECTS = '/projects' as const;
export const ROUTE_LOGIN = '/login' as const;
export const ROUTE_THEMES = '/themes' as const;
export const ROUTE_THREE = '/three' as const;

export const ROUTES = [
  ROUTE_HOME,
  ROUTE_ABOUT,
  ROUTE_RESUME,
  ROUTE_PROJECTS,
  ROUTE_LOGIN,
  ROUTE_THEMES,
  ROUTE_THREE,
] as const;

export type Route = (typeof ROUTES)[number];

const routeMessages = defineMessages({
  home: {
    id: 'Routes.home',
    defaultMessage: 'Home',
  },
  about: {
    id: 'Routes.about',
    defaultMessage: 'About',
  },
  resume: {
    id: 'Routes.resume',
    defaultMessage: 'Resume',
  },
  projects: {
    id: 'Routes.projects',
    defaultMessage: 'Projects',
  },
  login: {
    id: 'Routes.login',
    defaultMessage: 'Login',
  },
  themes: {
    id: 'Routes.themes',
    defaultMessage: 'Themes',
  },
});

export type NavOption = {
  label: MessageDescriptor;
  route: Route;
};

export const navOptions: NavOption[] = [
  {
    label: routeMessages.home,
    route: ROUTE_HOME,
  },
  {
    label: routeMessages.about,
    route: ROUTE_ABOUT,
  },
  {
    label: routeMessages.resume,
    route: ROUTE_RESUME,
  },
  {
    label: routeMessages.projects,
    route: ROUTE_PROJECTS,
  },
  {
    label: routeMessages.login,
    route: ROUTE_LOGIN,
  },
] as const;

export type SettingsOption = {
  label: MessageDescriptor;
  route?: string;
  component?: ReactNode;
};

export const settingsOptions: SettingsOption[] = [
  {
    label: routeMessages.themes,
    route: ROUTE_THEMES,
  },
] as const;

export const themeColors = [
  '--primary-bg-color',
  '--primary-accent-color',
  '--secondary-accent-color',
  '--primary-gradient-color',
] as const;

type RemovePrefix<S> = S extends `--${infer T}` ? T : never;

export type ThemeColor = RemovePrefix<(typeof themeColors)[number]>;
