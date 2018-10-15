import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { messengerSelector } from './common';

const emptyMap = Map();

export const getSearchContacts = createSelector(
    messengerSelector('contacts'),
    search => search.get('searchContacts', emptyMap)
);

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
