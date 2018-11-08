import { takeEvery, takeLatest, take, select, put } from 'redux-saga/effects';
import { SHOW_LOGIN, LOGIN_SUCCESS } from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';
import { showLogin } from '../actions/login';
import { resetAuth, saveAuth } from '../../helpers/localStorage';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
    yield takeLatest('user/SAVE_LOGIN', saveLogin);
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

function* saveLogin() {
    if (!process.env.BROWSER) {
        return;
    }

    resetAuth();

    const current = yield select(state => state.user.get('current'));

    if (!current) {
        return;
    }

    const username = current.get('username');
    const privateKeys = current.get('private_keys');
    const loginOwnerPubKey = current.get('login_owner_pubkey');

    if (!username) {
        return;
    }

    const postingPrivate = privateKeys.get('posting_private');

    if (!postingPrivate) {
        return;
    }

    const account = yield select(state => state.global.getIn(['accounts', username]));

    if (!account) {
        return;
    }

    if (isKeyActiveOrOwner(postingPrivate, account)) {
        return;
    }

    saveAuth(username, postingPrivate, privateKeys.get('memo_private'), loginOwnerPubKey);
}

function isKeyActiveOrOwner(privateKey, account) {
    const postingPubKey = privateKey.toPublicKey().toString();

    for (let key of ['active', 'owner']) {
        if (account.getIn([key, 'key_auths']).some(keyData => keyData.get(0) === postingPubKey)) {
            return true;
        }
    }
}
