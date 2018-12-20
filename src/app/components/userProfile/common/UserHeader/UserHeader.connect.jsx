import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import UserHeader from './UserHeader';
import { userHeaderSelector } from 'src/app/redux/selectors/userProfile/commonProfile';
import { checkWitness } from 'src/app/redux/actions/user';

export default connect(
    userHeaderSelector,
    { checkWitness }
)(UserHeader);
