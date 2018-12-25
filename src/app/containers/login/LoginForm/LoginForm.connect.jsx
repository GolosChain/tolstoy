import { connect } from 'react-redux';

import { userSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { loginCanceled } from 'src/app/redux/actions/login';
import { openResetKeysDialog } from 'src/app/redux/actions/dialogs';
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
        openResetKeysDialog,
    },
    null,
    { withRef: true }
)(LoginForm);
