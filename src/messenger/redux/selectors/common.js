import { Map } from 'immutable';
import { createSelector } from 'reselect';

const emptyMap = Map();

export const messengerSelector = type => state => state.messenger[type];

export const showResults = createSelector(
    messengerSelector('search'),
    search => search.get('showResults')
);

export const getAccounts = createSelector(
    messengerSelector('search'),
    search => search.get('accounts', emptyMap)
);