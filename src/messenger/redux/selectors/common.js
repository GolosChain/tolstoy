import { Map } from 'immutable';
import { createSelector } from "reselect";

const emptyMap = Map();

const searchData = state => state.messenger.search;

export const showResults = createSelector(
    searchData,
    data => data.get('showResults')
);

export const getAccounts = createSelector(
    searchData,
    data => data.get('accounts', emptyMap)
);