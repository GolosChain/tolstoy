import { fork } from 'redux-saga/effects';

import contacts from './contacts';

export default function* rootSaga() {
    yield fork(contacts);
}
