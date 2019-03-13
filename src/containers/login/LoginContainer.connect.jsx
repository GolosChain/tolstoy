import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { LoginContainer } from 'containers/login/LoginContainer';
import { currentUsernameSelector } from 'app/redux/selectors/common';

export default connect(
  createSelector(
    [currentUsernameSelector],
    username => ({ username })
  )
)(LoginContainer);
