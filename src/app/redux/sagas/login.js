import { takeEvery, call, put } from 'redux-saga/effects';
import {SHOW_LOGIN, LOGIN_SUCCESS} from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
    yield takeEvery(LOGIN_SUCCESS, loginSuccessWorker);
}

let dialog = null;

function* showLoginWorker({ payload }) {
    const { afterLoginRedirectToWelcome } = payload;
    dialog = yield call([DialogManager, 'showLogin'], afterLoginRedirectToWelcome);
}

function* loginSuccessWorker() {
    yield call([dialog, dialog.close])
}
