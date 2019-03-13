import { call, takeLatest } from 'redux-saga/effects';

import { MESSENGER_INIT } from 'src/messenger/redux/constants/messenger';
import { fetchContactsList } from './contacts';

export default function* watch() {
  yield takeLatest(MESSENGER_INIT, messengerInit);
}

function* messengerInit(action) {
  yield call(fetchContactsList, action);
}
