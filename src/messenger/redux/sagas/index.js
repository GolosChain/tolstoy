import { fork } from 'redux-saga/effects';

import messenger from './messenger';
import contacts from './contacts';

export default function* rootSaga() {
    yield fork(messenger);
    yield fork(contacts);
}
