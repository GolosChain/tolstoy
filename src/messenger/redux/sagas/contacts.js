import { call, takeLatest, put } from 'redux-saga/effects';
import { api } from 'golos-js';

import normalizeProfile from 'app/utils/NormalizeProfile'

import {
    CONTACTS_SEARCH,
    CONTACTS_SEARCH_SUCCESS,
    CONTACTS_SEARCH_SHOW_RESULTS
} from 'src/messenger/redux/constants/contacts'

export default function* watch() {
    yield takeLatest(CONTACTS_SEARCH, contactsSearch);
}

export function* contactsSearch({
    payload: { query, limit = 10 }
}) {
    const names = yield call(
        [api, api.lookupAccountsAsync],
        query,
        limit
    );

    if (!names.length) {
        return;
      }
    
    const result = {};
    const accounts = yield call([api, api.getAccountsAsync], names);
    if (accounts) {
        accounts.forEach(acc => {
            const { name, profile_image } = normalizeProfile(acc);
            result[acc.name] = {
                name: acc.name,
                profileName: name,
                profileImage: profile_image,
                memoKey: acc.memo_key
            };
        });

        yield put({
            type: CONTACTS_SEARCH_SUCCESS,
            payload: result
        });
        yield put({
            type: CONTACTS_SEARCH_SHOW_RESULTS,
            payload: {}
        });
    }
}
