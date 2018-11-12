import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select } from 'redux-saga/effects';
import { api } from 'golos-js';
import { PrivateKey } from 'golos-js/lib/auth/ecc';

import user from 'app/redux/User';
import { getAccount } from 'app/redux/sagas/shared';

// operations that require only posting authority
const postingOps = Set(['vote', 'comment', 'delete_comment', 'custom_json', 'account_metadata']);

export function* accountAuthLookup(account, privateKeys, isConfirmWithSave) {
    let auth = {
        posting: 'none',
        active: 'none',
        owner: 'none',
        memo: 'none',
    };

    if (isConfirmWithSave) {
        const currentAuth = yield select(state =>
            state.user.getIn(['authority', account.get('name')])
        );

        if (currentAuth) {
            auth = currentAuth.toJS();
        }
    }

    if (!privateKeys || !privateKeys['posting_private']) {
        return;
    }

    for (let role of ['posting', 'active']) {
        const privateKey = privateKeys[`${role}_private`];

        if (privateKey) {
            auth[role] = yield authorityLookup({
                pubKeys: Set([toPub(privateKey)]),
                authority: account.get(role),
                authType: role === 'active' ? 'active' : '',
            });
        }
    }

    if (account.get('memo_key') === toPub(privateKeys['memo_private'])) {
        auth.memo = 'full';
    }

    yield put(
        user.actions.setAuthority({
            accountName: account.get('name'),
            auth,
        })
    );
}

function* authorityLookup({ pubKeys, authority, authType }) {
    return yield call(authStr, { pubKeys, authority, authType });
}

function* authStr({ pubKeys, authority, authType, recurse = 1 }) {
    const t = yield call(threshold, { pubKeys, authority, authType, recurse });
    const r = authority.get('weight_threshold');

    return t >= r ? 'full' : t > 0 ? 'partial' : 'none';
}

function* threshold({ pubKeys, authority, authType, recurse = 1 }) {
    if (!pubKeys.size) {
        return 0;
    }

    const accountAuths = authority.get('account_auths');
    const accountAuthsNames = accountAuths.map(v => v.get(0), List());

    let t = pubKeyThreshold({ pubKeys, authority });

    if (accountAuthsNames.size) {
        const aaAccounts = yield api.getAccountsAsync(accountAuthsNames);
        const aaThreshes = accountAuths.map(v => v.get(1), List());

        for (let i = 0; i < aaAccounts.size; i++) {
            const aaAccount = aaAccounts.get(i);

            t += pubKeyThreshold({
                authority: aaAccount.get(authType),
                pubKeys,
            });

            if (recurse <= 2) {
                const auth = yield call(authStr, {
                    authority: aaAccount,
                    pubKeys,
                    recurse: ++recurse,
                });

                if (auth === 'full') {
                    t += aaThreshes.get(i);
                }
            }
        }
    }

    return t;
}

function pubKeyThreshold({ pubKeys, authority }) {
    const keyAuths = authority.get('key_auths');
    let available = 0;

    keyAuths.forEach(k => {
        if (pubKeys.has(k.get(0))) {
            available += k.get(1);
        }
    });

    return available;
}

export function* findSigningKey({ opType, username, password }) {
    const currentUser = yield select(state => state.user.get('current'));
    const currentUsername = currentUser && currentUser.get('username');

    username = username || currentUsername;

    if (!username) {
        return null;
    }

    const privateKeys = currentUsername === username ? currentUser.get('private_keys') : Map();

    const account = yield call(getAccount, username);

    if (!account) {
        throw new Error('Account not found');
    }

    const authTypes = postingOps.has(opType) ? ['posting', 'active'] : ['active', 'owner'];

    for (const authType of authTypes) {
        let privateKey;

        if (password) {
            try {
                privateKey = PrivateKey.fromWif(password);
            } catch (err) {
                privateKey = PrivateKey.fromSeed(username + authType + password);
            }
        } else {
            if (privateKeys) {
                privateKey = privateKeys.get(authType + '_private');
            }
        }

        if (privateKey) {
            const pubKeys = Set([privateKey.toPublicKey().toString()]);
            const authority = account.get(authType);
            const auth = yield call(authorityLookup, { pubKeys, authority, authType });

            if (auth === 'full') {
                return privateKey;
            }
        }
    }

    return null;
}

function toPub(k) {
    if (k) {
        return k.toPublicKey().toString();
    } else {
        return '-';
    }
}
