import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import UserHeader from './UserHeader';
import { userHeaderSelector } from 'src/app/redux/selectors/userProfile/commonProfile';

export default connect(
    userHeaderSelector,
    {}
)(UserHeader);
