import { createSelectorCreator, defaultMemoize, createSelector } from 'reselect';
import isEqual from 'react-fast-compare';
import { Map } from 'immutable';
import { path as pathRamda } from 'ramda';

const emptyMap = Map();
const toArray = data => (Array.isArray(data) ? data : [data]);

// Create a "selector creator" that uses react-fast-compare instead of '==='
// More info you can find in: https://github.com/reduxjs/reselect#api
export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

// export const routerSelector = state => state.router;

// old
export const globalSelector = path => state => state.global.getIn(toArray(path));
export const userSelector = path => state => state.user.getIn(toArray(path));
export const appSelector = path => state => state.app.getIn(toArray(path));
export const offchainSelector = path => state => state.offchain.getIn(toArray(path));
// new and our future
export const statusSelector = path => state => pathRamda(toArray(path))(state.status);
export const entitiesSelector = path => state => pathRamda(toArray(path))(state.entities);
export const dataSelector = path => state => pathRamda(toArray(path))(state.data);
export const uiSelector = path => state => pathRamda(toArray(path))(state.ui);

// Router selectors

export const routerParamSelector = name => (state, props) => props.params[name];

// Entities selectors

// Возвращает сущности определенного типа (type) в виде массива.
export const entitiesArraySelector = type =>
    createDeepEqualSelector([entitiesSelector(type)], entities => entities.toList());

// Возвращает конкретную сушность по указанному типу (type) сущности и её id
export const entitySelector = (type, id) =>
    createDeepEqualSelector([entitiesSelector(type)], entities => entities[id]);

// Users selectors

export const pageAccountSelector = createDeepEqualSelector(
    [globalSelector('accounts'), routerParamSelector('accountName')],
    (accounts, userName) => accounts.get(userName)
);

export const currentUserSelector = createDeepEqualSelector(
    [userSelector('current')],
    currentUser => currentUser || emptyMap
);

export const currentUsernameSelector = createDeepEqualSelector([currentUserSelector], user =>
    user.get('username')
);

// Utils

export const getVestsToGolosRatio = createSelector(
    [globalSelector('props')],
    globalProps =>
        parseFloat(globalProps.get('total_vesting_fund_steem')) /
        parseFloat(globalProps.get('total_vesting_shares'))
);
