import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { LoginPage } from 'src/app/containers/login/LoginPage';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';

export default connect(createSelector([currentUsernameSelector], username => ({ username })))(
    LoginPage
);
