import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';
import { defineMessages, MessageDescriptor } from 'react-intl';

const messages = defineMessages({
  profane: {
    id: 'validation.profane',
    defaultMessage: 'Display name contains bad words',
  },
  tooShortOrWhitespace: {
    id: 'Details.tooShortOrWhitespace',
    defaultMessage:
      'Display name must have 3 characters and have no leading or trailing spaces',
  },
  requirements: {
    id: 'validation.passwordRequirements',
    defaultMessage:
      'Password must be at least 6 characters, contain one lowercase character, one special character and have no leading or trailing spaces',
  },
  noMatch: {
    id: 'validation.noMatch',
    defaultMessage: 'Passwords do not match',
  },
  email: {
    id: 'validation.invalidEmail',
    defaultMessage: 'Please enter a valid email address',
  },
});

export const getDisplayNameError = (
  displayName: string,
): MessageDescriptor | undefined => {
  if (displayName.length < 3 || displayName !== displayName.trim()) {
    return messages.tooShortOrWhitespace;
  }

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });
  if (matcher.hasMatch(displayName)) {
    return messages.profane;
  }
};

export const getPasswordError = (
  password: string,
  confirmPassword: string,
): MessageDescriptor | undefined => {
  if (password.length < 6 || password !== password.trim()) {
    return messages.requirements;
  }

  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    return messages.requirements;
  }

  const specialCharacterRegex = /[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+-]/;
  const hasSpecialCharacter = specialCharacterRegex.test(password);
  if (!hasSpecialCharacter) {
    return messages.requirements;
  }

  if (password !== confirmPassword) {
    return messages.noMatch;
  }
};

export const getEmailError = (email: string): MessageDescriptor | undefined => {
  const REGEX = /\S+@\S+\.\S+/;

  if (!REGEX.test(email)) {
    return messages.email;
  }
};
