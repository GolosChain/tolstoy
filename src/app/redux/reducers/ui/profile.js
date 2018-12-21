import { fromJS } from 'immutable';
import {
    UI_PROFILE_CHANGE_LAYOUT,
    UI_PROFILE_ACTIVITY_CHANGE_TAB,
} from 'src/app/redux/constants/ui';
import { FETCH_WITNESS_DATA_SUCCESS } from 'src/app/redux/constants/user';

const LAYOUT_STORAGE_KEY = 'profile.layout';

const initialState = fromJS({
    layout: getSavedLayout() || 'list',
    activity: {
        currentTabId: 'all',
    },
    accountsWitnessesInfo: [],
});

export default function(state = initialState, { type, payload }) {
    if (!process.env.BROWSER) {
        return state;
    }

    switch (type) {
        case UI_PROFILE_CHANGE_LAYOUT:
            localStorage.setItem(LAYOUT_STORAGE_KEY, payload);
            return state.set('layout', payload);

        case UI_PROFILE_ACTIVITY_CHANGE_TAB:
            return state.setIn(['activity', 'currentTabId'], payload);

        case FETCH_WITNESS_DATA_SUCCESS:
            return state.update('accountsWitnessesInfo', list => list.push(fromJS(payload)));
    }

    return state;
}

function getSavedLayout() {
    try {
        return localStorage.getItem(LAYOUT_STORAGE_KEY);
    } catch (err) {}
}
