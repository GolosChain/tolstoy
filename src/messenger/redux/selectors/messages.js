import { createSelector } from 'reselect';
import { List } from 'immutable';

import { messengerSelector } from './common';
import { getSelectedContact } from './chat';

export const getThreadMessages = createSelector(
  getSelectedContact,
  messengerSelector('messages'),
  (selectedContact, messages) => {
    return messages.getIn(['threads', selectedContact.get('contact')], List());
  }
);
