import { takeEvery, call } from 'redux-saga/effects';
import {SHOW_LOGIN, LOGIN_SUCCESS} from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
    yield takeEvery(LOGIN_SUCCESS, loginSuccessWorker);
}

let dialog = null;

function* showLoginWorker() {
    dialog = yield call([DialogManager, 'showLogin']);
}

function* loginSuccessWorker() {
    if (dialog) {
        yield call([dialog, dialog.close]);
    }
}
