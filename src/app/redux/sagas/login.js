import { takeEvery, call } from 'redux-saga/effects';
import {SHOW_LOGIN, CLOSE_LOGIN} from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
}

function* showLoginWorker({ payload }) {
    const { afterLoginRedirectToWelcome } = payload;

    yield call([DialogManager, 'showLogin'], afterLoginRedirectToWelcome);
}
