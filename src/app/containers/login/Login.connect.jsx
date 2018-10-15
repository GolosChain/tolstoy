import { connect } from 'react-redux';
import { Login } from 'src/app/containers/login/Login';
import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';
import { userSelector } from 'src/app/redux/selectors/common';

export default connect(
    state => ({
        loginBroadcastOperation: userSelector('loginBroadcastOperation')(state),
        loginError: userSelector('login_error')(state),
        saveLoginDefault: userSelector('saveLoginDefault')(state),
    }),
    dispatch => {
        return {
            clearError: () => {
                dispatch(user.actions.loginError({ error: null }));
            },

            dispatchSubmit: (data, loginBroadcastOperation, afterLoginRedirectToWelcome) => {
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
            },
        };
    }
)(Login);
