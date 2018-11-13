import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';
import { SHOW_LOGIN, LOGIN_CANCELED, LOGIN_IF_NEED } from '../constants/login';

export function showLogin({ onClose } = {}) {
    return {
        type: SHOW_LOGIN,
        payload: {
            onClose,
        },
    };
}

export function dispatchLogin(
    { username, password, saveLogin, isLogin, isConfirm },
    loginBroadcastOperation
) {
    return dispatch => {
        if (loginBroadcastOperation) {
            const {
                type,
                operation,
                successCallback,
                errorCallback,
            } = loginBroadcastOperation.toJS();

            const success = () => {
                successCallback();
                dispatch(
                    user.actions.usernamePasswordLogin({
                        username,
                        password,
                        saveLogin,
                        isLogin,
                        isConfirm,
                        operationType: type,
                    })
                );
                dispatch(user.actions.closeLogin());
            };

            dispatch(
                transaction.actions.broadcastOperation({
                    type,
                    operation,
                    username,
                    password,
                    successCallback: success,
                    errorCallback,
                })
            );
        } else {
            dispatch(
                user.actions.usernamePasswordLogin({
                    username,
                    password,
                    saveLogin,
                    isLogin,
                    isConfirm,
                })
            );
        }
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
