import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { messengerSelector } from 'src/messenger/redux/selectors/common';
import { getSelectedChat } from 'src/messenger/redux/selectors/ui';

export const getSelectedContact = createSelector(
    getSelectedChat,
    messengerSelector('contacts'),
    (selectedChat, contacts) => {
        return contacts.getIn(
            [
                selectedChat.get('type') === 'search' ? 'searchContacts' : 'contactsList',
                selectedChat.get('contact'),
            ],
            Map()
        );
    }
);
