import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';

export function dispatchLogin(data, loginBroadcastOperation) {
    return dispatch => {
        const { username, password, saveLogin } = data;
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
                })
            );
        }
    };
}
