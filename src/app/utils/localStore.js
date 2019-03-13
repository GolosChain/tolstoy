const AUTH_KEY = 'authData';

export function saveAuth(username, privateKey) {
  const str = [username, privateKey].join(':');

  localStorage.setItem(AUTH_KEY, Buffer.from(str).toString('hex'));
}

export function getAuth() {
  const data = localStorage.getItem(AUTH_KEY);

  if (!data) {
    return null;
  }

  const parts = Buffer.from(data, 'hex')
    .toString()
    .split(':');

  if (parts.length < 2 || !parts[0] || !parts[1]) {
    return null;
  }

  return {
    accountName: parts[0],
    privateKey: parts[1],
  };
}

export function removeAuth() {
  localStorage.removeItem(AUTH_KEY);
}
