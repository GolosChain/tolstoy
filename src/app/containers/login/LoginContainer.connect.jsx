import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { LoginContainer } from 'src/app/containers/login/LoginContainer';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';

export default connect(
  createSelector(
    [currentUsernameSelector],
    username => ({ username })
  )
)(LoginContainer);
