import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import UserHeader from './UserHeader';
import { userHeaderSelector } from 'src/app/redux/selectors/userProfile/commonProfile';
import { checkWitness } from 'src/app/redux/actions/user';
import { updateFollow } from 'src/app/redux/actions/follow';
import { confirmUnfollowDialog } from 'src/app/redux/actions/dialogs';

export default connect(
    userHeaderSelector,
    { checkWitness, updateFollow, confirmUnfollowDialog }
)(UserHeader);
