import {
    CONTACTS_SEARCH,
    CONTACTS_SEARCH_HIDE_RESULTS
} from '../constants/contacts'

export function searchAccounts(query) {
    return dispatch => {
        dispatch(
            {
                type: CONTACTS_SEARCH,
                payload: { query }
            }
        );
    }
}

export function closeSearchResults() {
    return dispatch => {
        dispatch(
            {
                type: CONTACTS_SEARCH_HIDE_RESULTS,
                payload: {}
            }
        );
    }
}
