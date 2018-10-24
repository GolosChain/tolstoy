import { takeEvery, call, select, put } from 'redux-saga/effects';
import { SHOW_LOGIN, LOGIN_SUCCESS } from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';
import { showLogin } from '../actions/login';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
    yield takeEvery(LOGIN_SUCCESS, loginSuccessWorker);
}

let dialog = null;

function* showLoginWorker({ payload }) {
    dialog = DialogManager.showLogin();

    if (payload.onClose) {
        dialog.result.then(payload.onClose);
    }
}

export function* loginIfNeed() {
    const authorized = yield select(state => state.user.hasIn(['current', 'username']));

    if (authorized) {
        return true;
    }

    let _resolve;
    const promise = new Promise(resolve => (_resolve = resolve));

    yield put(
        showLogin({
            onClose: username => {
                _resolve(Boolean(username));
            },
        })
    );

    return yield promise;
}

function* loginSuccessWorker({ payload }) {
    if (dialog) {
        dialog._resolve(payload.username);
        yield call([dialog, dialog.close]);
    }
}
