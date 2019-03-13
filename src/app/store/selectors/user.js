import { createSelector } from 'reselect';
import { currentUsernameSelector } from './auth';

// eslint-disable-next-line
export const isOwnerSelector = userId =>
  createSelector(
    [currentUsernameSelector],
    currentUser => currentUser === userId
  );
