import { getStoreState } from 'app/clientRender';

const VOTE_PERCENT_THRESHOLD = 1000000;
export const USERS_NUMBER_IN_TOOLTIP = 8;

export function makeTooltip(accounts, isMore) {
    return accounts.join('<br>') + (isMore ? '<br>...' : '');
}

export function usersListForTooltip(usersList) {
    if (usersList.length > USERS_NUMBER_IN_TOOLTIP) {
        usersList = usersList.slice(0, USERS_NUMBER_IN_TOOLTIP);
    }
    return usersList;
}

export function isNeedShowSlider() {
    const state = getStoreState();

    const current = state.user.get('current');

    if (!current) {
        return false;
    }

    const netVesting =
        current.get('vesting_shares') -
        current.get('delegated_vesting_shares') +
        current.get('received_vesting_shares');

    return netVesting > VOTE_PERCENT_THRESHOLD;
}

export function getSavedPercent(key) {
    try {
        const percent = JSON.parse(localStorage.getItem(key));

        if (Number.isFinite(percent)) {
            return percent;
        }
    } catch (err) {}

    return 100;
}

export function savePercent(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {}
}
