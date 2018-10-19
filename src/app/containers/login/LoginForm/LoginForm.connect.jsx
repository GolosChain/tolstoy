import { connect } from 'react-redux';

import { userSelector } from 'src/app/redux/selectors/common';
import { dispatchLogin } from 'src/app/redux/actions/login';
import user from 'app/redux/User';
import { LoginForm } from './LoginForm';

export default connect(
    state => ({
        loginBroadcastOperation: userSelector('loginBroadcastOperation')(state),
        loginError: userSelector('login_error')(state),
    }),
    {
        clearError: () => user.actions.loginError({ error: null }),
        dispatchSubmit: dispatchLogin,
    }
)(LoginForm);
