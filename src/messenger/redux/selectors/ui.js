import { createSelector } from 'reselect';

import { messengerSelector } from './common';

export const showSearchResults = createSelector(
    messengerSelector('ui'),
    ui => ui.get('showSearchResults')
);

export const getSelectedChat = createSelector(
    messengerSelector('ui'),
    ui => ui.get('selectedChat')
);
