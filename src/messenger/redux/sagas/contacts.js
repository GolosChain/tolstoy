import { call, takeLatest, put, select } from 'redux-saga/effects';
import { fromPairs, indexBy, prop, mergeDeepLeft, keys } from 'ramda';
import { api } from 'mocks/golos-js';

import normalizeProfile from 'src/app/utils/NormalizeProfile';

import {
  CONTACTS_SEARCH,
  CONTACTS_SEARCH_SUCCESS,
  CONTACTS_GET_CONTACTS_LIST_SIZE_SUCCESS,
  CONTACTS_GET_CONTACTS_LIST_SUCCESS,
} from 'src/messenger/redux/constants/contacts';
import { UI_SEARCH_SHOW_RESULTS } from 'src/messenger/redux/constants/ui';
import { hasUnknownContacts } from 'src/messenger/redux/selectors/contacts';

export default function* watch() {
  yield takeLatest(CONTACTS_SEARCH, contactsSearch);
}

export function* contactsSearch({ payload: { query, limit = 10 } }) {
  const names = yield call([api, api.lookupAccountsAsync], query, limit);

  if (!names.length) {
    return;
  }

  const result = yield call(fetchAccountsInfo, names);

  yield put({
    type: CONTACTS_SEARCH_SUCCESS,
    payload: result,
  });
  yield put({
    type: UI_SEARCH_SHOW_RESULTS,
    payload: {},
  });
}

function* getContactsSize(owner) {
  const { size } = yield call([api, api.getContactsSizeAsync], owner);
  const sizeObj = fromPairs(size);

  yield put({
    type: CONTACTS_GET_CONTACTS_LIST_SIZE_SUCCESS,
    payload: sizeObj,
  });
}

export function* getContactsList(owner, type = 'pinned', limit = 100, offset = 0) {
  return yield call([api, api.getContactsAsync], owner, type, limit, offset);
}

export function* fetchContactsList({ payload: { owner } }) {
  yield call(getContactsSize, owner);

  let contacts = yield call(getContactsList, owner);

  const hasUnknown = yield select(hasUnknownContacts);
  if (hasUnknown) {
    const uContacts = yield call(getContactsList, owner, 'unknown');
    contacts = [...contacts, ...uContacts];
  }

  contacts = indexBy(prop('contact'), contacts);
  const contactsInfo = yield call(fetchAccountsInfo, keys(contacts));

  contacts = mergeDeepLeft(contacts, contactsInfo);

  yield put({
    type: CONTACTS_GET_CONTACTS_LIST_SUCCESS,
    payload: contacts,
  });
}

const reduceAccountInfo = account => {
  const { name, profile_image } = normalizeProfile(account);
  return {
    contact: account.name,
    profileName: name,
    profileImage: profile_image,
    memoKey: account.memo_key,
  };
};

function* fetchAccountsInfo(names) {
  const result = {};
  const accounts = yield call([api, api.getAccountsAsync], names);
  if (accounts) {
    accounts.forEach(acc => {
      result[acc.name] = reduceAccountInfo(acc);
    });
  }
  return result;
}
