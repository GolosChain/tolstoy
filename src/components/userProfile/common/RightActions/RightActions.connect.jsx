import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { currentUsernameSelector } from 'src/app/redux/selectors/common';
// import {
//     openConvertDialog,
//     openDelegateVestingDialog,
//     openTransferDialog,
//     openSafeDialog,
// } from 'src/app/redux/actions/dialogs';

import RightActions from './RightActions';

export default connect(
  // createSelector(
  //     [currentUsernameSelector, (state, props) => props.pageAccountName.toLowerCase()],
  //     (currentUsername, pageUsername) => ({
  //         isOwner: currentUsername === pageUsername,
  //     })
  // ),
  () => ({
    isOwner: false,
  }),
  {
    openConvertDialog: () => {},
    openDelegateVestingDialog: () => {},
    openTransferDialog: () => {},
    openSafeDialog: () => {},
  }
)(RightActions);
