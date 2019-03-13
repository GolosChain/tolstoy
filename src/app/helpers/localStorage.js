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

export function tryRestoreAuth() {
  const data = localStorage.getItem(SAVE_KEY);

  if (!data) {
    return;
  }

  const parts = new Buffer(data, 'hex').toString().split('\t');

  if (parts.length < 2 || !parts[0] || !parts[1]) {
    return null;
  }

  // auto-login with a low security key (like a posting key)
  // The 'password' in this case must be the posting private wif. See setItem('autopost')
  return {
    username: parts[0],
    password: parts[1],
    memoWif: clean(parts[2]),
    loginOwnerPubKey: clean(parts[3]),
  };
}

export function resetSavedAuth() {
  localStorage.removeItem(SAVE_KEY);
}

function clean(value) {
  if (value == null || value === '' || value === 'null' || value === 'undefined') {
    return undefined;
  }

  return value;
}
