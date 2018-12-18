import throttle from 'lodash/throttle';
import { api } from 'golos-js';
import { getStoreState, dispatch } from 'app/clientRender';

export const MINNOW = 1000000;
export const CRUCIAN = 10000000;
export const DOLPHIN = 100000000;
export const ORCA = 1000000000;

let usersToLoad = [];
let currentLoading = [];

export function loadUserLazy(accountName) {
    if (
        accountName &&
        !usersToLoad.includes(accountName) &&
        !currentLoading.includes(accountName)
    ) {
        const state = getStoreState();

        if (!state.global.hasIn(['accounts', accountName])) {
            usersToLoad.push(accountName);
            lazyLoadUsers();
        }
    }
}

const lazyLoadUsers = throttle(
    async function() {
        try {
            currentLoading = usersToLoad;
            usersToLoad = [];
            const accounts = await api.getAccountsAsync(currentLoading);

            dispatch({
                type: 'global/RECEIVE_ACCOUNTS',
                payload: {
                    accounts,
                },
            });

            currentLoading = [];
        } catch (err) {
            console.error(err);
        }
    },
    100,
    { leading: false }
);

export const getUserStatus = gests => {
    if (gests < 0) {
        return null;
    } else if (gests < MINNOW) {
        return 'minnow';
    } else if (gests < CRUCIAN) {
        return 'crucian';
    } else if (gests < DOLPHIN) {
        return 'dolphin';
    } else if (gests < ORCA) {
        return 'orca';
    } else {
        return 'whale';
    }
};
