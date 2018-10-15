import { connect } from 'react-redux';
import { Login } from 'src/app/containers/login/Login';
import user from 'app/redux/User';
import { userSelector } from 'src/app/redux/selectors/common';
import { dispatchLogin } from 'src/app/redux/actions/login';

export default connect(
    state => ({
        loginBroadcastOperation: userSelector('loginBroadcastOperation')(state),
        loginError: userSelector('login_error')(state),
    }),
    {
        clearError: () => user.actions.loginError({ error: null }),
        dispatchSubmit: dispatchLogin,
    }
)(Login);
