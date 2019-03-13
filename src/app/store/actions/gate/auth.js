/* eslint-disable no-shadow */
import commun from 'communjs';
import { sign } from 'communjs/lib/auth';
import ecc from 'eosjs-ecc';

import { CALL_GATE } from 'store/middlewares/gate-api';
import {
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_ERROR,
  AUTH_LOGOUT,
  SET_SERVER_ACCOUNT_NAME,
  GATE_AUTHORIZE_SECRET,
  GATE_AUTHORIZE_SECRET_SUCCESS,
  GATE_AUTHORIZE_SECRET_ERROR,
  GATE_AUTHORIZE,
  GATE_AUTHORIZE_SUCCESS,
  GATE_AUTHORIZE_ERROR,
} from 'store/constants';

export const setServerAccountName = accountName => ({
  type: SET_SERVER_ACCOUNT_NAME,
  payload: {
    accountName,
  },
});

const getAuthSecret = () => ({
  [CALL_GATE]: {
    types: [GATE_AUTHORIZE_SECRET, GATE_AUTHORIZE_SECRET_SUCCESS, GATE_AUTHORIZE_SECRET_ERROR],
    method: 'auth.generateSecret',
    params: {},
  },
});

const gateAuthorize = (secret, user, sign) => ({
  [CALL_GATE]: {
    types: [GATE_AUTHORIZE, GATE_AUTHORIZE_SUCCESS, GATE_AUTHORIZE_ERROR],
    method: 'auth.authorize',
    params: { secret, user, sign },
  },
});

export const login = (username, key) => async dispatch => {
  try {
    const { secret } = await dispatch(getAuthSecret());
    let signature;

    let actualKey = key;

    try {
      signature = sign(secret, key);
    } catch (err) {
      // Попробовать взять активный ключ из пароля
      if (err.message.startsWith('Invalid checksum,') && key.startsWith('P')) {
        const activeSeed = `${username}active${key}`;
        const activeKey = ecc.PrivateKey.fromSeed(activeSeed).toString();

        signature = sign(secret, activeKey);

        actualKey = activeKey;
      } else {
        throw err;
      }
    }

    const auth = await dispatch(gateAuthorize(secret, username, signature));

    commun.initProvider(actualKey);

    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: { currentUser: { accountName: auth.user } } });

    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    document.cookie = `commun.username=${username}; path=/; expires=${date.toGMTString()}`;

    return auth;
  } catch (err) {
    dispatch({ type: AUTH_LOGIN_ERROR, error: err.message });
    throw err;
  }
};

export const logout = () => dispatch => {
  document.cookie = `commun.username=; Expires=${new Date().toGMTString()}`;

  dispatch({ type: AUTH_LOGOUT, payload: {} });
};
