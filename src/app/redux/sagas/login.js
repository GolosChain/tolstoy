import { takeEvery, call, put } from 'redux-saga/effects';
import { SHOW_LOGIN } from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';
import user from 'app/redux/User';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
}

function* showLoginWorker({ payload }) {
    const { afterLoginRedirectToWelcome } = payload;

    yield call([DialogManager, 'showLogin'], afterLoginRedirectToWelcome);
    yield put(user.actions.hideLogin());
}
