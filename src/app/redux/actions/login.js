import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';

export function dispatchLogin(data, loginBroadcastOperation, afterLoginRedirectToWelcome) {
    return dispatch => {
        const { username, password, saveLogin } = data;
        if (loginBroadcastOperation) {
            const {
                type,
                operation,
                successCallback,
                errorCallback,
            } = loginBroadcastOperation.toJS();
            dispatch(
                transaction.actions.broadcastOperation({
                    type,
                    operation,
                    username,
                    password,
                    successCallback,
                    errorCallback,
                })
            );
            dispatch(
                user.actions.usernamePasswordLogin({
                    username,
                    password,
                    saveLogin,
                    afterLoginRedirectToWelcome,
                    operationType: type,
                })
            );
            dispatch(user.actions.closeLogin());
        } else {
            dispatch(
                user.actions.usernamePasswordLogin({
                    username,
                    password,
                    saveLogin,
                    afterLoginRedirectToWelcome,
                })
            );
        }
    };
}
