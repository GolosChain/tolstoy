import { takeEvery, take, select, put } from 'redux-saga/effects';
import { SHOW_LOGIN, LOGIN_SUCCESS } from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';
import { showLogin } from '../actions/login';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
}

function* showLoginWorker({ payload } = {}) {
    const dialog = DialogManager.showLogin({
        isConfirm: Boolean(payload.operation),
        operationType: payload.operation ? payload.operation.type : null,
        onClose: payload.onClose,
    });

    const action = yield take(LOGIN_SUCCESS);

    dialog.close(action.payload.username);
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
