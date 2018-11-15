import { connect } from 'react-redux';

import { userSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { loginCanceled } from 'src/app/redux/actions/login';
import user from 'app/redux/User';
import { LoginForm } from './LoginForm';

export default connect(
    state => ({
        loginError: userSelector('login_error')(state),
        currentUsername: currentUsernameSelector(state),
    }),
    {
        clearError: () => user.actions.loginError({ error: null }),
        dispatchLogin: user.actions.usernamePasswordLogin,
        loginCanceled,
    },
    null,
    { withRef: true }
)(LoginForm);
