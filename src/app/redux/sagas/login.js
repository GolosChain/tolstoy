import { takeEvery, call, select, put } from 'redux-saga/effects';
import { SHOW_LOGIN, LOGIN_SUCCESS } from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';
import { showLogin } from '../actions/login';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
    yield takeEvery(LOGIN_SUCCESS, loginSuccessWorker);
}

let dialog = null;

function* showLoginWorker({ payload } = {}) {
    dialog = DialogManager.showLogin({ onClose: payload.onClose });
}

export function* loginIfNeed() {
    const authorized = yield select(state => state.user.hasIn(['current', 'username']));

    if (authorized) {
        return true;
    }

    let action;

    const promise = new Promise(resolve => {
        action = put(
            showLogin({
                onClose: username => {
                    resolve(Boolean(username));
                },
            })
        );
    });

    yield action;

    return yield promise;
}

function* loginSuccessWorker({ payload }) {
    if (dialog) {
        dialog.close(payload.username);
    }
}
