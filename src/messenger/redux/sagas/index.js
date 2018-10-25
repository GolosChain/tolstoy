import { fork } from 'redux-saga/effects';

import messenger from './messenger';
import contacts from './contacts';
import transactions from './transactions';
import messages from './messages';

export default function* rootSaga() {
    yield fork(messenger);
    yield fork(contacts);
    yield fork(transactions);
    yield fork(messages);
}
