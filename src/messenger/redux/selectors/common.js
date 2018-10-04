import { Map } from 'immutable';
import { createSelector } from 'reselect';

const emptyMap = Map();

export const messengerSelector = type => state => state.messenger[type];
export const searchSelector = messengerSelector('search');

export const showResults = createSelector(
    searchSelector,
    data => data.get('showResults')
);

export const getAccounts = createSelector(
    searchSelector,
    data => data.get('accounts', emptyMap)
);