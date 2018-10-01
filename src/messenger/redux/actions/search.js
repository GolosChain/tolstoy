import {
    CONTACTS_SEARCH,
    CONTACTS_SEARCH_HIDE_RESULTS
} from '../constants/contacts'

export function searchAccounts(query) {
    return {
        type: CONTACTS_SEARCH,
        payload: { query }
    }
}

export function closeSearchResults() {
    return {
        type: CONTACTS_SEARCH_HIDE_RESULTS,
        payload: {}
    }
}
