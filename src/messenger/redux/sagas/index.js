import { fork } from 'redux-saga/effects';

import messenger from 'src/messenger/redux/sagas/messenger';
import contacts from 'src/messenger/redux/sagas/contacts';
import transactions from 'src/messenger/redux/sagas/transactions';

export default function* rootSaga() {
    yield fork(messenger);
    yield fork(contacts);
    yield fork(transactions);
}
