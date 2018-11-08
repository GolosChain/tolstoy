const SAVE_KEY = 'autopost2';

export function saveAuth(username, postingPrivate, memoKey, loginOwnerPubKey) {
    const saveString = [
        username,
        postingPrivate.toWif(),
        memoKey ? memoKey.toWif() : '',
        loginOwnerPubKey || '',
    ].join('\t');

    localStorage.setItem(SAVE_KEY, new Buffer(saveString).toString('hex'));
}

export function tryRestoreAuth(loginInfo) {
    const data = localStorage.getItem(SAVE_KEY);

    if (!data) {
        return;
    }

    const parts = new Buffer(data, 'hex').toString().split('\t');

    // auto-login with a low security key (like a posting key)
    // The 'password' in this case must be the posting private wif. See setItem('autopost')
    loginInfo.autoLogin = true;
    loginInfo.username = parts[0];
    loginInfo.password = parts[1];
    loginInfo.memoWif = clean(parts[2]);
    loginInfo.loginOwnerPubKey = clean(parts[3]);
}

export function resetAuth() {
    localStorage.removeItem(SAVE_KEY);
}

function clean(value) {
    if (value == null || value === '' || value === 'null' || value === 'undefined') {
        return undefined;
    }

    return value;
}
