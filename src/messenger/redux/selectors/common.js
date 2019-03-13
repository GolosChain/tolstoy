import { createSelector } from 'reselect';

import normalizeProfile from 'src/app/utils/NormalizeProfile';

import {
  globalSelector,
  currentUserSelector,
  currentUsernameSelector,
} from 'src/app/redux/selectors/common';

export const messengerSelector = type => state => state.messenger[type];

export const getCurrentUserProfileImage = createSelector(
  globalSelector('accounts'),
  currentUsernameSelector,
  (accounts, currentUserName) => {
    const current = accounts.get(currentUserName);
    const { profile_image } = normalizeProfile(current.toJS());
    return profile_image;
  }
);

export const getCurrentUserPrivateMemoKey = createSelector(
  currentUserSelector,
  current => current.getIn(['private_keys', 'memo_private'])
);
