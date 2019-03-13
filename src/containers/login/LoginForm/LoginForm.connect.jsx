import { connect } from 'react-redux';

import { login } from 'store/actions/gate/auth';

// import { userSelector, currentUsernameSelector } from 'app/redux/selectors/common';
// import { loginCanceled } from 'app/redux/actions/login';
// import { openResetKeysDialog } from 'app/redux/actions/dialogs';
import { LoginForm } from './LoginForm';

export default connect(
  state => ({
    // loginError: userSelector('login_error')(state),
    // currentUsername: currentUsernameSelector(state),
    loginError: null,
    currentUsername: null,
  }),
  {
    // clearError: () => user.actions.loginError({ error: null }),
    // dispatchLogin: user.actions.usernamePasswordLogin,
    // loginCanceled,
    // openResetKeysDialog: (...args) => openResetKeysDialog(...args),
    login,
    clearError: () => {},
    dispatchLogin: () => {},
    loginCanceled: () => {},
    openResetKeysDialog: () => {},
  },
  null,
  { withRef: true }
)(LoginForm);
