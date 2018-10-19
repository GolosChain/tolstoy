import { createSelectorCreator, defaultMemoize, createSelector } from 'reselect';
import isEqual from 'react-fast-compare';
import { Map } from 'immutable';
import { pathOr } from 'ramda';
import memorize from 'lodash/memoize';

const emptyMap = Map();
const toArray = data => (Array.isArray(data) ? data : [data]);

// Create a "selector creator" that uses react-fast-compare instead of '==='
// More info you can find in: https://github.com/reduxjs/reselect#api
export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

// export const routerSelector = state => state.router;

// old
export const globalSelector = (path, defaultValue) => state =>
    state.global.getIn(toArray(path), defaultValue);
export const userSelector = (path, defaultValue) => state =>
    state.user.getIn(toArray(path), defaultValue);
export const appSelector = (path, defaultValue) => state =>
    state.app.getIn(toArray(path), defaultValue);
export const offchainSelector = (path, defaultValue) => state =>
    state.offchain.getIn(toArray(path), defaultValue);
// new and our future
export const statusSelector = (path, defaultValue) => state =>
    pathOr(defaultValue, toArray(path))(state.status);
export const entitiesSelector = (path, defaultValue) => state =>
    pathOr(defaultValue, toArray(path))(state.entities);
export const dataSelector = (path, defaultValue) => state =>
    pathOr(defaultValue, toArray(path))(state.data);
export const uiSelector = (path, defaultValue) => state =>
    pathOr(defaultValue, toArray(path))(state.ui);

// Router selectors

export const routerParamSelector = name => (state, props) => props.params[name];
export const routeParamSelector = name => state =>
    state.ui.location.getIn(['current', 'params', name]);
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

export const currentUserSelector = userSelector('current');

export const currentUsernameSelector = createSelector(
    [currentUserSelector],
    user => (user ? user.get('username') : null)
);

export const parseJSON = memorize(JSON.parse);

// Utils

export const getVestsToGolosRatio = createSelector(
    [globalSelector('props')],
    globalProps =>
        parseFloat(globalProps.get('total_vesting_fund_steem')) /
        parseFloat(globalProps.get('total_vesting_shares'))
);
