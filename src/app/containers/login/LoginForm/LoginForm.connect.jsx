import { connect } from 'react-redux';

import { userSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { dispatchLogin, loginCanceled } from 'src/app/redux/actions/login';
import user from 'app/redux/User';
import { LoginForm } from './LoginForm';

export default connect(
    state => ({
        loginBroadcastOperation: userSelector('loginBroadcastOperation')(state),
        loginError: userSelector('login_error')(state),
        currentUsername: currentUsernameSelector(state),
    }),
    {
        clearError: () => user.actions.loginError({ error: null }),
        dispatchLogin,
        loginCanceled,
    },
    null,
    { withRef: true }
)(LoginForm);
