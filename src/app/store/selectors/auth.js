// eslint-disable-next-line import/prefer-default-export
import { dataSelector } from './common';

export const currentUserSelector = dataSelector(['auth', 'currentUser']);

export const currentUsernameSelector = dataSelector(['auth', 'currentUser', 'accountName']);

export const currentUsernameUnsafeSelector = state => {
  if (!process.browser) {
    return dataSelector(['serverAuth', 'accountName'])(state);
  }

  return currentUsernameSelector(state);
};
