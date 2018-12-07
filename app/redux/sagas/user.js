import { fromJS } from 'immutable';
import { call, put, select, fork, takeLatest, takeEvery } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { api } from 'golos-js';
import { PrivateKey, Signature, hash } from 'golos-js/lib/auth/ecc';

import { accountAuthLookup } from 'app/redux/sagas/auth';
import user from 'app/redux/User';
import { getAccount } from 'app/redux/sagas/shared';
import { broadcastOperation } from 'app/redux/sagas/transaction';
import { serverApiLogin, serverApiLogout } from 'app/utils/ServerApiClient';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import { loadFollows } from 'app/redux/sagas/follow';
import uploadImageWatch from '../UserSaga_UploadImage';
import { tryRestoreAuth, resetSavedAuth } from 'src/app/helpers/localStorage';
import { saveCurrentUserAuth } from 'src/app/redux/sagas/login';
import { logSuccessOperationEvent } from 'src/app/helpers/gaLogs';

const COMPROMISED_ERROR =
    'Hello. Your account may have been compromised. We are working on restoring an access to your account. Please send an email to t@cyber.fund.';

const PERMISSIONS_ERROR =
    'This login gives owner or active permissions and should not be used here. Please provide a posting only login.';

export function* userWatches() {
    yield fork(watchRemoveHighSecurityKeys); // keep first to remove keys early when a page change happens
    yield fork(autoLoginWatch);
    yield fork(loginWatch);
    yield fork(logoutWatch);
    yield fork(loginErrorWatch);
    yield fork(lookupPreviousOwnerAuthorityWatch);
    yield fork(uploadImageWatch);
}

const highSecurityPages = [
    /\/market/,
    /\/@.+\/(transfers|permissions|password|settings)/,
    /\/~witnesses/,
];

function* lookupPreviousOwnerAuthorityWatch() {
    yield takeLatest('user/lookupPreviousOwnerAuthority', lookupPreviousOwnerAuthority);
}

function* loginWatch() {
    yield takeLatest('user/USERNAME_PASSWORD_LOGIN', usernamePasswordLogin);
}

function* autoLoginWatch() {
    yield takeLatest('user/AUTO_LOGIN', tryAutoLogin);
}

function* logoutWatch() {
    yield takeLatest('user/LOGOUT', logout);
}

function* loginErrorWatch() {
    yield takeLatest('user/LOGIN_ERROR', loginError);
}

function* watchRemoveHighSecurityKeys() {
    yield takeEvery('@@router/LOCATION_CHANGE', removeHighSecurityKeys);
}

function* removeHighSecurityKeys({ payload: { pathname } }) {
    // Let the user keep the active key when going from one high security page to another.
    if (highSecurityPages.every(regExp => !regExp.test(pathname))) {
        yield put(user.actions.removeHighSecurityKeys());
    }
}

function* tryAutoLogin() {
    if (yield isNeedSkipLogin()) {
        return;
    }

    const loginInfo = tryRestoreAuth();

    if (loginInfo) {
        loginInfo.autoLogin = true;

        yield usernamePasswordLoginInner({}, loginInfo);
    } else {
        // no saved user
        if (yield select(state => state.offchain.get('account'))) {
            serverApiLogout();
        }
    }
}

function* usernamePasswordLogin({ payload }) {
    if (payload.loginOperation) {
        const error = yield call(broadcastOperation, {
            payload: {
                ...payload.loginOperation,
                username: payload.username,
                password: payload.password,
            },
        });

        if (error) {
            return;
        }
    }

    if (yield isNeedSkipLogin()) {
        return;
    }

    // Если мы зашли сюда из диалога подтверждения, но галка "сохранить на время сессии"
    // выключена, то делать ничего не надо.
    if (payload.isConfirm && !payload.saveLogin) {
        yield put(user.actions.hideLogin());
        return;
    }

    const loginInfo = {
        username: payload.username,
        password: payload.password,
        loginOwnerPubKey: null,
        loginWifOwnerPubKey: null,
        memoWif: null,
        privateKeys: null,

        isLogin: payload.isLogin,
        isConfirm: payload.isConfirm,
    };

    yield usernamePasswordLoginInner(payload, loginInfo);
}

function* usernamePasswordLoginInner(
    { saveLogin, operationType, afterLoginRedirectToWelcome },
    loginInfo
) {
    if (loginInfo.username.indexOf('/') !== -1) {
        // "alice/active" will login only with Alices active key
        const [username, userProvidedRole] = loginInfo.username.split('/');

        loginInfo.username = username;
        loginInfo.userProvidedRole = userProvidedRole;
    }

    const account = yield call(getAccount, loginInfo.username);

    if (!account) {
        yield setLoginError('Username does not exist');
        return;
    }

    loginInfo.privateKeys = extractPrivateKeys(loginInfo);

    const authority = yield call(
        accountAuthLookup,
        account,
        loginInfo.privateKeys,
        loginInfo.isConfirm
    );

    if (
        !loginInfo.isLogin &&
        loginInfo.userProvidedRole &&
        authority[loginInfo.userProvidedRole] !== 'full'
    ) {
        yield setLoginError('Incorrect Password');
        return;
    }

    let hasActiveKey = false;

    if (loginInfo.isLogin && authority['active'] === 'full') {
        authority['active'] = 'none';
        hasActiveKey = true;
    }

    yield put(
        user.actions.setAuthority({
            accountName: account.get('name'),
            authority,
        })
    );

    if (Object.values(authority).every(auth => auth !== 'full')) {
        yield onAuthorizeError(account, loginInfo, hasActiveKey);
        return;
    }

    const ownerPubKey = account.getIn(['owner', 'key_auths', 0, 0]);
    const activePubKey = account.getIn(['active', 'key_auths', 0, 0]);
    const postingPubKey = account.getIn(['posting', 'key_auths', 0, 0]);

    deleteUnneededPrivateKeys(loginInfo, authority, account, ownerPubKey, activePubKey);

    if (loginInfo.isLogin && (postingPubKey === ownerPubKey || postingPubKey === activePubKey)) {
        yield setLoginError(PERMISSIONS_ERROR);
        resetSavedAuth();
        return;
    }

    yield setUser(loginInfo, account, !operationType || saveLogin);
    yield put(user.actions.hideLogin());

    if (saveLogin) {
        if (!loginInfo.autoLogin && loginInfo.privateKeys.posting_private) {
            yield saveCurrentUserAuth();
        }
    } else if (loginInfo.isLogin) {
        resetSavedAuth();
    }

    try {
        yield doServerLogin(loginInfo);
    } catch (err) {
        console.error('Server login error:', err);
    }

    yield loadCurrentUserFollowing();

    const hasLocale = yield select(state => state.user.get('locale'));
    if (hasLocale) {
        yield put(user.actions.changeLocale(null));
    }

    if (afterLoginRedirectToWelcome) {
        browserHistory.push('/welcome');
    }
}

function* isNeedSkipLogin() {
    const { pathname, query } = yield select(state => state.routing.locationBeforeTransitions);
    const { to, amount, token, memo } = query;

    const sender = pathname.split('/')[1].substring(1);
    const externalTransferRequested = Boolean(to && amount && token && memo);

    const offchainAccount = yield select(state => state.offchain.get('account'));

    return externalTransferRequested && offchainAccount && offchainAccount !== sender;
}

function deleteUnneededPrivateKeys(loginInfo, authority, account, ownerPubKey, activePubKey) {
    if (authority['posting'] !== 'full') {
        delete loginInfo.privateKeys['posting_private'];
    }

    if (authority['active'] !== 'full') {
        delete loginInfo.privateKeys['active_private'];
    }

    const memoPrivate = loginInfo.privateKeys['memo_private'];

    if (memoPrivate) {
        const memoPubKey = memoPrivate.toPublicKey().toString();

        if (
            memoPubKey !== account.get('memo_key') ||
            memoPubKey === ownerPubKey ||
            memoPubKey === activePubKey
        ) {
            delete loginInfo.privateKeys['memo_private'];
        }
    }
}

function* setLoginError(text) {
    yield put(user.actions.loginError({ error: text }));
}

function* logout() {
    yield put(user.actions.saveLoginConfirm(false));
    if (process.env.BROWSER) {
        resetSavedAuth();
        localStorage.removeItem('guid');
    }

    const response = yield serverApiLogout();
    if (response.ok) {
        logSuccessOperationEvent('Sign out, success');
    }
}

function* loginError() {
    serverApiLogout();
}

/**
 * If the owner key was changed after the login owner key, this function will find the next owner
 * key history record after the change and store it under user.previous_owner_authority.
 */
function* lookupPreviousOwnerAuthority() {
    const current = yield select(state => state.user.get('current'));

    if (!current) {
        return;
    }

    const loginOwnerPubKey = current.get('login_owner_pubkey');

    if (!loginOwnerPubKey) {
        return;
    }

    const username = current.get('username');
    const keyAuths = yield select(state =>
        state.global.getIn(['accounts', username, 'owner', 'key_auths'])
    );

    if (keyAuths && keyAuths.some(key => key.get(0) === loginOwnerPubKey)) {
        return;
    }

    let ownerHistory = yield call([api, api.getOwnerHistoryAsync], username);

    if (!ownerHistory.length) {
        return;
    }

    ownerHistory.sort((b, a) => compareFunc(a['last_valid_time'], b['last_valid_time']));

    const previousOwnerAuthority = ownerHistory.find(item => {
        const auth = item['previous_owner_authority'];

        return auth['key_auths'].some(
            key => key[0] === loginOwnerPubKey && key[1] >= auth['weight_threshold']
        );
    });

    if (!previousOwnerAuthority) {
        console.log('UserSaga ---> Login owner does not match owner history');
        return;
    }

    yield put(
        user.actions.setUser({
            previous_owner_authority: previousOwnerAuthority,
        })
    );
}

function* loadCurrentUserFollowing() {
    const username = yield select(state => state.user.getIn(['current', 'username']));

    if (username) {
        yield fork(loadFollows, 'getFollowingAsync', username, 'blog');
        yield fork(loadFollows, 'getFollowingAsync', username, 'ignore');
    }
}

function* onAuthorizeError(account, loginInfo, hasActiveKey) {
    resetSavedAuth();

    const ownerPubKey = account.getIn(['owner', 'key_auths', 0, 0]);

    let errorText = null;

    if (ownerPubKey === 'STM7sw22HqsXbz7D2CmJfmMwt9rimtk518dRzsR1f8Cgw52dQR1pR') {
        errorText = COMPROMISED_ERROR;
    } else if (
        ownerPubKey === loginInfo.loginOwnerPubKey ||
        ownerPubKey === loginInfo.loginWifOwnerPubKey
    ) {
        errorText = 'owner_login_blocked';
    } else if (loginInfo.isLogin && hasActiveKey) {
        // При попытке залогиниться активным ключем показываем ошибку
        errorText = 'active_login_blocked';
    } else {
        recordLoginAttempt(loginInfo, ownerPubKey);
        errorText = 'Incorrect Password';
    }

    yield setLoginError(errorText);
}

function* doServerLogin(loginInfo) {
    const offchainData = yield select(state => state.offchain);
    const serverAccount = offchainData.get('account');
    const challengeString = offchainData.get('login_challenge');

    if (serverAccount || !challengeString) {
        return;
    }

    const signatures = {};
    const postingPrivate = loginInfo.privateKeys['posting_private'];

    if (postingPrivate) {
        const bufSha = hash.sha256(JSON.stringify({ token: challengeString }, null, 0));

        signatures['posting'] = Signature.signBufferSha256(bufSha, postingPrivate).toHex();
    }

    const response = yield serverApiLogin(loginInfo.username, signatures);

    if (loginInfo.isLogin && response.ok) {
        logSuccessOperationEvent('Sign in, success');
    }
    response.json().then(result => {
        if (result.guid) {
            localStorage.setItem('guid', result.guid);
        }
    });
}

function extractPrivateKeys(loginInfo) {
    function isRole(role, fn) {
        if (loginInfo.userProvidedRole && role !== loginInfo.userProvidedRole) {
            return;
        }

        return fn();
    }

    function getPrivateTypeKey(type) {
        return PrivateKey.fromSeed(loginInfo.username + type + loginInfo.password);
    }

    let privateKeys;

    try {
        const privateKey = PrivateKey.fromWif(loginInfo.password);

        loginInfo.loginWifOwnerPubKey = privateKey.toPublicKey().toString();

        privateKeys = {
            posting_private: isRole('posting', () => privateKey),
            active_private: isRole('active', () => privateKey),
            memo_private: privateKey,
        };
    } catch (err) {
        // Password (non wif)
        const seed = loginInfo.username + 'owner' + loginInfo.password;

        loginInfo.loginOwnerPubKey = PrivateKey.fromSeed(seed)
            .toPublicKey()
            .toString();

        privateKeys = {
            posting_private: isRole('posting', () => getPrivateTypeKey('posting')),
            active_private: isRole('active', () => getPrivateTypeKey('active')),
            memo_private: getPrivateTypeKey('memo'),
        };
    }

    if (loginInfo.memoWif) {
        privateKeys['memo_private'] = PrivateKey.fromWif(loginInfo.memoWif);
    }

    return privateKeys;
}

function* setUser(loginInfo, account, keepLogin) {
    const userData = {
        username: loginInfo.username,
        vesting_shares: account.get('vesting_shares'),
        received_vesting_shares: account.get('received_vesting_shares'),
        delegated_vesting_shares: account.get('delegated_vesting_shares'),
    };

    // If user is signing operation by operation and has no saved login, don't save to RAM
    // Keep the posting key in RAM but only when not signing an operation.
    // No operation or the user has checked: Keep me logged in...
    if (keepLogin) {
        userData.private_keys = fromJS(loginInfo.privateKeys);
        userData.login_owner_pubkey = loginInfo.loginOwnerPubKey;
    }

    yield put(user.actions.setUser(userData));
}

function compareFunc(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}

function recordLoginAttempt(loginInfo, ownerPubKey) {
    serverApiRecordEvent(
        'login_attempt',
        JSON.stringify({
            name: loginInfo.username,
            login_owner_pubkey: loginInfo.loginOwnerPubKey,
            owner_pub_key: ownerPubKey,
            generated_type: loginInfo.password[0] === 'P' && loginInfo.password.length > 40,
        })
    );
}
