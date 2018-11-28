import { fork, call, put, select, takeEvery } from 'redux-saga/effects';
import { fromJS, Set, Map } from 'immutable';
import getSlug from 'speakingurl';
import tt from 'counterpart';
import { api, broadcast, auth, memo } from 'golos-js';
import { PrivateKey, PublicKey } from 'golos-js/lib/auth/ecc';

import { getAccount, getContent } from 'app/redux/sagas/shared';
import { findSigningKey } from 'app/redux/sagas/auth';
import { showNotification } from 'src/app/redux/actions/ui';
import g from 'app/redux/GlobalReducer';
import user from 'app/redux/User';
import tr from 'app/redux/Transaction';
import { DEBT_TICKER } from 'app/client_config';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import constants from './../constants';
import DialogManager from 'app/components/elements/common/DialogManager';
import { CLOSED_LOGIN_DIALOG } from 'src/app/redux/constants/common';

export function* transactionWatches() {
    yield fork(watchForBroadcast);
    yield fork(watchForUpdateAuthorities);
    yield fork(watchForUpdateMeta);
    yield fork(watchForRecoverAccount);
}

function* watchForBroadcast() {
    yield takeEvery('transaction/BROADCAST_OPERATION', broadcastOperation);
}

function* watchForUpdateAuthorities() {
    yield takeEvery('transaction/UPDATE_AUTHORITIES', updateAuthorities);
}

function* watchForUpdateMeta() {
    yield takeEvery('transaction/UPDATE_META', updateMeta);
}

function* watchForRecoverAccount() {
    yield takeEvery('transaction/RECOVER_ACCOUNT', recoverAccount);
}

const hook = {
    preBroadcast_comment,
    preBroadcast_transfer,
    preBroadcast_vote,
    preBroadcast_account_witness_vote,
    preBroadcast_custom_json,
    error_vote,
    error_custom_json,
    // error_account_update,
    error_account_witness_vote,
    accepted_comment,
    accepted_delete_comment,
    accepted_vote,
    accepted_account_update,
    accepted_withdraw_vesting,
};

function* preBroadcast_transfer({ operation }) {
    let memoStr = operation.memo;

    if (memoStr) {
        memoStr = toStringUtf8(memoStr);
        memoStr = memoStr.trim();

        if (/^#/.test(memoStr)) {
            const memo_private = yield select(state =>
                state.user.getIn(['current', 'private_keys', 'memo_private'])
            );
            if (!memo_private) {
                throw new Error('Unable to encrypte memo, missing memo private key');
            }

            const account = yield call(getAccount, operation.to);
            if (!account) {
                throw new Error(`Unknown to account ${operation.to}`);
            }

            const memo_key = account.get('memo_key');
            memoStr = memo.encode(memo_private, memo_key, memoStr);
            operation.memo = memoStr;
        }
    }

    return operation;
}

function toStringUtf8(o) {
    if (!o) {
        return o;
    }

    if (Buffer.isBuffer(o)) {
        return o.toString('utf-8');
    } else {
        return o.toString();
    }
}

function* preBroadcast_vote({ operation, username }) {
    if (!operation.voter) {
        operation.voter = username;
    }

    const { voter, author, permlink, weight } = operation;
    // give immediate feedback
    yield put(g.actions.set({ key: `transaction_vote_active_${author}_${permlink}`, value: true }));
    yield put(g.actions.voted({ username: voter, author, permlink, weight }));

    return operation;
}

function* preBroadcast_account_witness_vote({ operation, username }) {
    if (!operation.account) {
        operation.account = username;
    }

    const { account, witness, approve } = operation;
    yield put(g.actions.updateAccountWitnessVote({ account, witness, approve }));

    return operation;
}

function* preBroadcast_custom_json({ operation }) {
    const json = JSON.parse(operation.json);

    if (operation.id === 'follow') {
        try {
            if (json[0] === 'follow') {
                const {
                    follower,
                    following,
                    what: [action],
                } = json[1];

                yield put(
                    g.actions.update({
                        key: ['follow', 'getFollowingAsync', follower],
                        notSet: Map(),
                        updater: m => {
                            //m = m.asMutable()
                            if (action == null) {
                                m = m.update('blog_result', Set(), r => r.delete(following));
                                m = m.update('ignore_result', Set(), r => r.delete(following));
                            } else if (action === 'blog') {
                                m = m.update('blog_result', Set(), r => r.add(following));
                                m = m.update('ignore_result', Set(), r => r.delete(following));
                            } else if (action === 'ignore') {
                                m = m.update('ignore_result', Set(), r => r.add(following));
                                m = m.update('blog_result', Set(), r => r.delete(following));
                            }
                            m = m.set('blog_count', m.get('blog_result', Set()).size);
                            m = m.set('ignore_count', m.get('ignore_result', Set()).size);
                            return m; //.asImmutable()
                        },
                    })
                );
            }
        } catch (err) {
            console.error(
                'transaction saga unrecognized follow custom_json format',
                operation.json
            );
        }
    }

    return operation;
}

function* error_account_witness_vote({ operation: { account, witness, approve } }) {
    yield put(g.actions.updateAccountWitnessVote({ account, witness, approve: !approve }));
}

/** Keys, username, and password are not needed for the initial call.  This will check the login and may trigger an action to prompt for the password / key. */
export function* broadcastOperation({
    payload: {
        type,
        operation,
        confirm,
        warning,
        keys,
        username,
        password,
        hideErrors,
        successCallback,
        errorCallback,
    },
}) {
    const confirmText = typeof confirm === 'function' ? confirm() : confirm;

    if (confirmText) {
        if (!(yield DialogManager[warning ? 'dangerConfirm' : 'confirm'](confirmText))) {
            errorCallback();
            return;
        }
    }

    if (!keys) {
        keys = [];
    }

    try {
        if (!keys.length) {
            // user may already be logged in, or just entered a signing password or wif
            const signingKey = yield call(findSigningKey, { opType: type, username, password });

            if (signingKey) {
                keys.push(signingKey);
            } else if (!password) {
                yield put(
                    user.actions.showLogin({
                        loginOperation: {
                            type,
                            operation,
                            username,
                            successCallback,
                            errorCallback,
                            saveLogin: true,
                        },
                        onClose: () => {
                            errorCallback(CLOSED_LOGIN_DIALOG);
                        },
                    })
                );
                return;
            }
        }

        const error = yield call(broadcastPayload, {
            payload: {
                operations: [[type, operation]],
                keys,
                username,
                hideErrors,
                successCallback,
                errorCallback,
            },
        });

        if (error) {
            return error;
        }

        let eventType = type
            .replace(/^([a-z])/, g => g.toUpperCase())
            .replace(/_([a-z])/g, g => g[1].toUpperCase());

        if (eventType === 'Comment' && !operation.parent_author) {
            eventType = 'Post';
        }

        const page = eventType === 'Vote' ? `@${operation.author}/${operation.permlink}` : '';
        serverApiRecordEvent(eventType, page);
    } catch (err) {
        console.error('transaction saga', err);

        if (errorCallback) {
            errorCallback(err.toString());
        }

        return err;
    }
}

function* broadcastPayload({
    payload: { operations, keys, username, hideErrors, successCallback, errorCallback },
}) {
    if ($STM_Config.read_only_mode) {
        yield put(showNotification(tt('g.read_only_mode_notify'), 'trx'));
        return;
    }

    for (const [type] of operations) {
        // see also transaction/ERROR
        yield put(tr.actions.remove({ key: ['TransactionError', type] }));
    }

    {
        const newOps = [];
        for (const [type, operation] of operations) {
            if (hook['preBroadcast_' + type]) {
                const op = yield call(hook['preBroadcast_' + type], { operation, username });
                if (Array.isArray(op)) {
                    for (const o of op) {
                        newOps.push(o);
                    }
                } else {
                    newOps.push([type, op]);
                }
            } else {
                newOps.push([type, operation]);
            }
        }

        operations = newOps;
    }

    try {
        yield new Promise((resolve, reject) => {
            broadcast.send({ extensions: [], operations }, keys, err => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                for (const [type, operation] of operations) {
                    if (hook['broadcasted_' + type]) {
                        try {
                            hook['broadcasted_' + type]({ operation });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }

                resolve();
            });
        });

        // status: accepted
        for (const [type, operation] of operations) {
            if (hook['accepted_' + type]) {
                try {
                    yield call(hook['accepted_' + type], { operation });
                } catch (error) {
                    console.error(error);
                }
            }

            const config = operation.__config;

            if (config && config.successMessage) {
                yield put(showNotification(config.successMessage, 'trx'));
            }
        }
        if (successCallback) {
            try {
                successCallback();
            } catch (error) {
                console.error(error);
            }
        }
    } catch (err) {
        console.error('transaction saga\tbroadcast', err);
        // status: error

        yield put(tr.actions.error({ operations, error: err, hideErrors, errorCallback }));

        for (const [type, operation] of operations) {
            if (hook['error_' + type]) {
                try {
                    yield call(hook['error_' + type], { operation });
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return err;
    }
}

function* accepted_comment({ operation }) {
    const { author, permlink } = operation;
    // update again with new $$ amount from the steemd node
    yield call(getContent, { author, permlink });
    // receiveComment did the linking already (but that is commented out)
    yield put(g.actions.linkReply(operation));
    // mark the time (can only post 1 per min)
    // yield put(user.actions.acceptedComment())
}

function* accepted_delete_comment({ operation }) {
    yield put(g.actions.deleteContent(operation));
}

function* accepted_vote({ operation: { author, permlink, weight } }) {
    console.log('Vote accepted, weight', weight, 'on', author + '/' + permlink, 'weight');
    // update again with new $$ amount from the steemd node
    yield put(
        g.actions.remove({
            key: `transaction_vote_active_${author}_${permlink}`,
        })
    );
    yield call(getContent, { author, permlink });
}

function* accepted_withdraw_vesting({ operation }) {
    let [account] = yield call([api, api.getAccountsAsync], [operation.account]);
    account = fromJS(account);
    yield put(g.actions.receiveAccount({ account }));
}

function* accepted_account_update({ operation }) {
    let [account] = yield call([api, api.getAccountsAsync], [operation.account]);
    account = fromJS(account);
    yield put(g.actions.receiveAccount({ account }));
}

import base58 from 'bs58';
import secureRandom from 'secure-random';

function* preBroadcast_comment({ operation, username }) {
    if (!operation.author) {
        operation.author = username;
    }

    let permlink = operation.permlink;
    const {
        author,
        __config: { originalBody, autoVote, comment_options },
    } = operation;

    const { parent_author = '', parent_permlink = operation.category } = operation;
    const { title } = operation;
    let { body } = operation;

    body = body.trim();

    // TODO Slightly smaller blockchain comments: if body === json_metadata.steem.link && Object.keys(steem).length > 1 remove steem.link ..This requires an adjust of get_state and the API refresh of the comment to put the steem.link back if Object.keys(steem).length >= 1

    let body2;
    if (originalBody) {
        const patch = createPatch(originalBody, body);
        // Putting body into buffer will expand Unicode characters into their true length
        if (patch && patch.length < new Buffer(body, 'utf-8').length) {
            body2 = patch;
        }
    }

    if (!body2) {
        body2 = body;
    }

    if (!permlink) {
        permlink = yield createPermlink(title, author, parent_author, parent_permlink);
    }

    const md = operation.json_metadata;
    const json_metadata = typeof md === 'string' ? md : JSON.stringify(md);
    const op = {
        ...operation,
        permlink: permlink.toLowerCase(),
        parent_author,
        parent_permlink,
        json_metadata,
        title: new Buffer((operation.title || '').trim(), 'utf-8'),
        body: new Buffer(body2, 'utf-8'),
    };

    const comment_op = [['comment', op]];

    // comment_options must come directly after comment
    if (comment_options) {
        const {
            max_accepted_payout = ['1000000.000', DEBT_TICKER].join(' '),
            percent_steem_dollars = 10000, // 10000 === 100%
            allow_votes = true,
            allow_curation_rewards = true,
        } = comment_options;

        comment_op.push([
            'comment_options',
            {
                author,
                permlink,
                max_accepted_payout,
                percent_steem_dollars,
                allow_votes,
                allow_curation_rewards,
                extensions: [], // [0, { beneficiaries: [{ account: 'golosio', weight: 1000 }] }]
            },
        ]);
    }

    if (autoVote) {
        const vote = { voter: op.author, author: op.author, permlink: op.permlink, weight: 10000 };
        comment_op.push(['vote', vote]);
    }

    return comment_op;
}

function* createPermlink(title, author, parent_author, parent_permlink) {
    let permlink;

    if (title && title.trim() !== '') {
        let s = slug(title);

        if (s === '') {
            s = base58.encode(secureRandom.randomBuffer(4));
        }

        // ensure the permlink(slug) is unique
        const slugState = yield call(
            [api, api.getContentAsync],
            author,
            s,
            constants.DEFAULT_VOTE_LIMIT
        );

        let prefix;
        if (slugState.body !== '') {
            // make sure slug is unique
            prefix = base58.encode(secureRandom.randomBuffer(4)) + '-';
        } else {
            prefix = '';
        }
        permlink = prefix + s;
    } else {
        // comments: re-parentauthor-parentpermlink-time
        const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
        parent_permlink = parent_permlink.replace(/(-\d{8}t\d{9}z)/g, '');
        permlink = `re-${parent_author}-${parent_permlink}-${timeStr}`;
    }

    if (permlink.length > 255) {
        // STEEMIT_MAX_PERMLINK_LENGTH
        permlink = permlink.substring(permlink.length - 255, permlink.length);
    }

    // only letters numbers and dashes shall survive
    permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
    return permlink;
}

import diff_match_patch from 'diff-match-patch';
const dmp = new diff_match_patch();

function createPatch(text1, text2) {
    if (!text1 && text1 === '') {
        return undefined;
    }

    const patches = dmp.patch_make(text1, text2);
    const patch = dmp.patch_toText(patches);

    return patch;
}

function* error_custom_json({ operation: { id, required_posting_auths } }) {
    if (id === 'follow') {
        const follower = required_posting_auths[0];
        yield put(
            g.actions.update({
                key: ['follow', 'getFollowingAsync', follower, 'loading'],
                updater: () => null,
            })
        );
    }
}

function* error_vote({ operation: { author, permlink } }) {
    yield put(g.actions.remove({ key: `transaction_vote_active_${author}_${permlink}` }));
    yield call(getContent, { author, permlink }); // unvote
}

function slug(text) {
    return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

const pwPubkey = (name, pw, role) => auth.wifToPublic(auth.toWif(name, pw.trim(), role));

function* recoverAccount({
    payload: { account_to_recover, old_password, new_password, onError, onSuccess },
}) {
    const [account] = yield call([api, api.getAccountsAsync], [account_to_recover]);

    if (!account) {
        onError('Unknown account ' + account);
        return;
    }

    if (auth.isWif(new_password)) {
        onError('Your new password should not be a WIF');
        return;
    }

    if (auth.isPubkey(new_password)) {
        onError('Your new password should not be a Public Key');
        return;
    }

    const oldOwnerPrivate = auth.isWif(old_password)
        ? old_password
        : auth.toWif(account_to_recover, old_password, 'owner');

    const oldOwner = auth.wifToPublic(oldOwnerPrivate);

    const newOwnerPrivate = auth.toWif(account_to_recover, new_password.trim(), 'owner');
    const newOwner = auth.wifToPublic(newOwnerPrivate);
    const newActive = pwPubkey(account_to_recover, new_password.trim(), 'active');
    const newPosting = pwPubkey(account_to_recover, new_password.trim(), 'posting');
    const newMemo = pwPubkey(account_to_recover, new_password.trim(), 'memo');

    const new_owner_authority = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[newOwner, 1]],
    };

    const recent_owner_authority = {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[oldOwner, 1]],
    };

    try {
        yield broadcast.sendAsync(
            {
                extensions: [],
                operations: [
                    [
                        'recover_account',
                        {
                            account_to_recover,
                            new_owner_authority,
                            recent_owner_authority,
                        },
                    ],
                ],
            },
            [oldOwnerPrivate, newOwnerPrivate]
        );

        // change password
        // change password probably requires a separate transaction (single trx has not been tested)
        const { json_metadata } = account;
        yield broadcast.sendAsync(
            {
                extensions: [],
                operations: [
                    [
                        'account_update',
                        {
                            account: account.name,
                            active: {
                                weight_threshold: 1,
                                account_auths: [],
                                key_auths: [[newActive, 1]],
                            },
                            posting: {
                                weight_threshold: 1,
                                account_auths: [],
                                key_auths: [[newPosting, 1]],
                            },
                            memo_key: newMemo,
                            json_metadata,
                        },
                    ],
                ],
            },
            [newOwnerPrivate]
        );

        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        console.error('Recover account', error);

        if (onError) {
            onError(error);
        }
    }
}

/** auths must start with most powerful key: owner for example */
// const twofaAccount = 'steem'
function* updateAuthorities({
    payload: { accountName, signingKey, auths, twofa, onSuccess, onError },
}) {
    // Be sure this account is up-to-date (other required fields are sent in the update)
    const [account] = yield call([api, api.getAccountsAsync], [accountName]);

    if (!account) {
        onError('Account not found');
        return;
    }

    const ops2 = {};
    let oldPrivate;

    const addAuth = (authType, oldAuth, newAuth) => {
        let oldAuthPubkey, oldPrivateAuth;
        try {
            oldPrivateAuth = PrivateKey.fromWif(oldAuth);
            oldAuthPubkey = oldPrivateAuth.toPublic().toString();
        } catch (err) {
            try {
                oldAuthPubkey = PublicKey.fromStringOrThrow(oldAuth).toString();
            } catch (err) {}
        }

        if (!oldAuthPubkey) {
            if (!oldAuth) {
                onError('Missing old key, not sure what to replace');
                console.error('Missing old key, not sure what to replace');
                return false;
            }

            oldPrivateAuth = PrivateKey.fromSeed(accountName + authType + oldAuth);
        }

        if (authType === 'owner' && !oldPrivate) {
            oldPrivate = oldPrivateAuth;
        } else if (authType === 'active' && !oldPrivate) {
            oldPrivate = oldPrivateAuth;
        } else if (authType === 'posting' && !oldPrivate) {
            oldPrivate = oldPrivateAuth;
        }

        let newPrivate, newAuthPubkey;
        try {
            newPrivate = PrivateKey.fromWif(newAuth);
            newAuthPubkey = newPrivate.toPublicKey().toString();
        } catch (e) {
            newPrivate = PrivateKey.fromSeed(accountName + authType + newAuth);
            newAuthPubkey = newPrivate.toPublicKey().toString();
        }

        let authority;
        if (authType === 'memo') {
            account.memo_key = newAuthPubkey;
        } else {
            authority = fromJS(account[authType]).toJS();
            authority.key_auths = [];
            authority.key_auths.push([newAuthPubkey, authority.weight_threshold]);
        }

        ops2[authType] = authority ? authority : account[authType];

        return true;
    };

    for (const auth of auths) {
        if (!addAuth(auth.authType, auth.oldAuth, auth.newAuth)) {
            return;
        }
    }

    let key = oldPrivate;
    if (!key) {
        try {
            key = PrivateKey.fromWif(signingKey);
        } catch (err) {
            // probably updating a memo .. see if we got an active or owner
            const auth = authType => {
                const priv = PrivateKey.fromSeed(accountName + authType + signingKey);
                const pubkey = priv.toPublicKey().toString();
                const authority = account[authType];
                const key_auths = authority.key_auths;

                for (let i = 0; i < key_auths.length; i++) {
                    if (key_auths[i][0] === pubkey) {
                        return priv;
                    }
                }

                return null;
            };

            key = auth('active');

            if (!key) {
                key = auth('owner');
            }
        }
    }

    if (!key) {
        onError(`Incorrect Password`);
        throw new Error('Trying to update a memo without a signing key?');
    }

    const { memo_key, json_metadata } = account;
    const payload = {
        type: 'account_update',
        operation: {
            account: account.name,
            ...ops2,
            memo_key,
            json_metadata,
        },
        keys: [key],
        successCallback: onSuccess,
        errorCallback: onError,
    };

    yield call(broadcastOperation, { payload });
}

/** auths must start with most powerful key: owner for example */
// const twofaAccount = 'steem'
function* updateMeta(params) {
    const { meta, account_name, signingKey, onSuccess, onError } = params.payload.operation;
    console.log('meta', meta);
    console.log('account_name', account_name);
    // Be sure this account is up-to-date (other required fields are sent in the update)
    const [account] = yield call([api, api.getAccountsAsync], [account_name]);

    if (!account) {
        onError('Account not found');
        return;
    }

    if (!signingKey) {
        onError(`Incorrect Password`);
        throw new Error('Have to pass owner key in order to change meta');
    }

    try {
        console.log('account.name', account.name);
        const operations = [
            'update_account_meta',
            {
                account_name: account.name,
                json_meta: JSON.stringify(meta),
            },
        ];

        yield broadcast.sendAsync({ extensions: [], operations }, [signingKey]);

        if (onSuccess) {
            onSuccess();
        }
    } catch (err) {
        console.error('Update meta', err);

        if (onError) {
            onError(err);
        }
    }
}
