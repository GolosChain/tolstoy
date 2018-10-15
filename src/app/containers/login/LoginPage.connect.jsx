import { connect } from 'react-redux';

import { LoginPage } from 'src/app/containers/login/LoginPage';
import { currentUserSelector } from 'src/app/redux/selectors/common';

export default connect(state => ({ currentUser: currentUserSelector(state).get('username') }))(
    LoginPage
);
