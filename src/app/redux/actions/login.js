import { SHOW_LOGIN, LOGIN_CANCELED, LOGIN_IF_NEED } from '../constants/login';

export function showLogin({ onClose } = {}) {
    return {
        type: SHOW_LOGIN,
        payload: {
            onClose,
        },
    };
}

export function loginCanceled() {
    return {
        type: LOGIN_CANCELED,
        payload: {},
    };
}

export function loginIfNeed(callback) {
    return {
        type: LOGIN_IF_NEED,
        payload: {
            callback,
        },
    };
}
