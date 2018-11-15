import { takeEvery, takeLatest, take, select, put } from 'redux-saga/effects';
import { SHOW_LOGIN, LOGIN_SUCCESS, LOGIN_IF_NEED } from 'src/app/redux/constants/login';
import DialogManager from 'app/components/elements/common/DialogManager';
import { showLogin } from '../actions/login';
import { resetAuth, saveAuth } from '../../helpers/localStorage';

export default function* watch() {
    yield takeEvery(SHOW_LOGIN, showLoginWorker);
    yield takeLatest('user/SAVE_LOGIN', saveLogin);

    yield takeEvery(LOGIN_IF_NEED, loginIfNeedWrapper);
}

function* showLoginWorker({ payload } = {}) {
    const { username, authType, forceSave, operation, onClose } = payload;

    let fullUsername = username;

    if (fullUsername && authType) {
        fullUsername += `/${authType}`;
    }

    const dialog = DialogManager.showLogin({
        username: fullUsername,
        isConfirm: Boolean(payload.operation || authType),
        forceSave,
        operationType: operation ? operation.type : null,
        onClose,
    });

    const action = yield take(LOGIN_SUCCESS);

    dialog.close(action.payload.username);
}

function* loginIfNeedWrapper({ payload }) {
    payload.callback(yield loginIfNeed());
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
