import { createSelector } from 'reselect';

import { messengerSelector } from './common';

export const getSize = createSelector(
    messengerSelector('contacts'),
    contacts => contacts.get('size')
);

export const getContactList= createSelector(
    messengerSelector('contacts'),
    contacts => contacts.get('contactsList')
);

export const hasUnknownContacts = createSelector(
    getSize,
    size => size.getIn(['unknown', 'total_contacts']) > 0
);
