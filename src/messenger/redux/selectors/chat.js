import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { messengerSelector } from './common';
import { getSelectedChat } from './ui';

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
