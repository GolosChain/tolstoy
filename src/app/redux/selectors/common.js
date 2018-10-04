import { createSelectorCreator, defaultMemoize, createSelector } from 'reselect';
import isEqual from 'react-fast-compare';
import { Map } from 'immutable';
import { path } from 'ramda';

const emptyMap = Map();

// Create a "selector creator" that uses react-fast-compare instead of '==='
// More info you can find in: https://github.com/reduxjs/reselect#api
export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

// export const routerSelector = state => state.router;
export const globalSelector = type => state =>
    state.global.getIn(Array.isArray(type) ? type : [type], emptyMap);
export const userSelector = type => state =>
    state.user.getIn(Array.isArray(type) ? type : [type], emptyMap);
export const statusSelector = type => state => state.status[type];
export const entitiesSelector = type => state => state.entities[type];
export const dataSelector = type => state => path(Array.isArray(type) ? type : [type])(state.data);
export const uiSelector = type => state => state.ui[type];

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
