import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Login } from 'src/app/containers/login/Login';
import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';

let saveLoginDefault = true;
if (process.env.BROWSER) {
    saveLoginDefault = localStorage.getItem('saveLogin') === 'yes';
}

export default connect(
    state => {
        return {
            loginBroadcastOperation: state.user.get('loginBroadcastOperation'),
        };
    },
    dispatch => {
        return {
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
                            saveLogin: false,
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
