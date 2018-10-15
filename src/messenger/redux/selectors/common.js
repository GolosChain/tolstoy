import { Map } from 'immutable';
import { createSelector } from 'reselect';

import { currentUserSelector } from 'src/app/redux/selectors/common';

export const messengerSelector = type => state => state.messenger[type];

export const getCurrentUserPrivateMemoKey = createSelector(
    currentUserSelector,
    current => current.getIn(['private_keys', 'memo_private'])
);
