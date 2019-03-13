import { connect } from 'react-redux';

// import { userSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
// import { loginCanceled } from 'src/app/redux/actions/login';
// import { openResetKeysDialog } from 'src/app/redux/actions/dialogs';
import { LoginForm } from './LoginForm';

export default connect(
    state => ({
        // loginError: userSelector('login_error')(state),
        // currentUsername: currentUsernameSelector(state),
        loginError: null,
        currentUsername: 'currentUsername',
    }),
    {
        // clearError: () => user.actions.loginError({ error: null }),
        // dispatchLogin: user.actions.usernamePasswordLogin,
        // loginCanceled,
        // openResetKeysDialog: (...args) => openResetKeysDialog(...args),
        clearError: () => {},
        dispatchLogin: () => {},
        loginCanceled: () => {},
        openResetKeysDialog: () => {},
    },
    null,
    { withRef: true }
)(LoginForm);
