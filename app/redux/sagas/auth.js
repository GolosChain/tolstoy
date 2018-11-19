import { Set, Map } from 'immutable';
import { call, select } from 'redux-saga/effects';
import { PrivateKey } from 'golos-js/lib/auth/ecc';

import { getAccount } from 'app/redux/sagas/shared';

// operations that require only posting authority
const postingOps = Set(['vote', 'comment', 'delete_comment', 'custom_json', 'account_metadata']);

export function* accountAuthLookup(account, privateKeys, isConfirmWithSave) {
    let authority = {
        posting: 'none',
        active: 'none',
        owner: 'none',
        memo: 'none',
    };

    if (isConfirmWithSave) {
        const auth = yield select(state => state.user.getIn(['authority', account.get('name')]));

        if (auth) {
            authority = auth.toJS();
        }
    }

    for (let role of ['posting', 'active']) {
        const privateKey = privateKeys[`${role}_private`];

        if (privateKey) {
            authority[role] = yield call(authStr, {
                pubKey: toPub(privateKey),
                authority: account.get(role),
                authType: role === 'active' ? 'active' : '',
            });
        }
    }

    if (account.get('memo_key') === toPub(privateKeys['memo_private'])) {
        authority.memo = 'full';
    }

    return authority;
}

function* authStr({ pubKey, authority, authType, recurse = 1 }) {
    const t = yield call(threshold, { pubKey, authority, authType, recurse });
    const r = authority.get('weight_threshold');

    return t >= r ? 'full' : t > 0 ? 'partial' : 'none';
}

function* threshold({ pubKey, authority, authType, recurse = 1 }) {
    return pubKeyThreshold({ pubKey, authority });

    /**
     * Этот код раньше был, но не работал, так как в цикле было условие
     *     for (let i = 0; i < aaAccounts.size; i++) {
     * где aaAccounts.size был undefined, так как golos-js возвращает обычный массив.
     */
    // let t = pubKeyThreshold({ pubKey, authority })
    // const accountAuths = authority.get('account_auths');
    //
    // if (accountAuths.size) {
    //     const accountAuthsNames = accountAuths.map(v => v.get(0));
    //
    //     const aaAccounts = yield api.getAccountsAsync(accountAuthsNames);
    //     const aaThreshes = accountAuths.map(v => v.get(1));
    //
    //     for (let i = 0; i < aaAccounts.length; i++) {
    //         const aaAccount = fromJS(aaAccounts[i]);
    //
    //         t += pubKeyThreshold({
    //             authority: aaAccount.get(authType),
    //             pubKey,
    //         });
    //
    //         if (recurse <= 2) {
    //             const auth = yield call(authStr, {
    //                 authority: aaAccount,
    //                 pubKey,
    //                 recurse: ++recurse,
    //             });
    //
    //             if (auth === 'full') {
    //                 t += aaThreshes.get(i);
    //             }
    //         }
    //     }
    // }
    //
    // return t;
}

function pubKeyThreshold({ pubKey, authority }) {
    const keyAuths = authority.get('key_auths');
    let available = 0;

    keyAuths.forEach(k => {
        if (pubKey === k.get(0)) {
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

    for (let authType of authTypes) {
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
            const auth = yield call(authStr, {
                pubKey: privateKey.toPublicKey().toString(),
                authority: account.get(authType),
                authType,
            });

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
