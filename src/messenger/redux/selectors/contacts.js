import { createSelector } from 'reselect';

import { messengerSelector } from './common';

export const contactsSelector = messengerSelector('contacts');

export const getSize = createSelector(
    contactsSelector,
    contacts => contacts.get('size')
);

export const getContactList= createSelector(
    contactsSelector,
    contacts => contacts.get('contactsList')
);

export const hasUnknownContacts = createSelector(
    getSize,
    size => size.getIn(['unknown', 'total_contacts']) > 0
);
