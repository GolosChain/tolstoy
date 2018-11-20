import { connect } from 'react-redux';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';

import MainNavigation from './MainNavigation';

export default connect(state => ({
    myAccountName: currentUsernameSelector(state),
}))(MainNavigation);
