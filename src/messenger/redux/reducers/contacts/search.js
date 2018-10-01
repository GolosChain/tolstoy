import { fromJS } from 'immutable';

import {
    CONTACTS_SEARCH_SUCCESS,
    CONTACTS_SEARCH_SHOW_RESULTS,
    CONTACTS_SEARCH_HIDE_RESULTS
} from 'src/messenger/redux/constants/contacts';

const initialState = fromJS({
    accounts: [],
    showResults: false
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case CONTACTS_SEARCH_SUCCESS: 
            return state.set('accounts', fromJS(payload));
        case CONTACTS_SEARCH_SHOW_RESULTS:
            return state.set('showResults', true);
        case CONTACTS_SEARCH_HIDE_RESULTS:
            return state.set('showResults', false);
        default:
            return state;
    }
}
