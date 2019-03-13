import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { currentUsernameSelector } from 'app/redux/selectors/common';
// import { followSelector } from 'app/redux/selectors/follow/follow';
// import { updateFollow } from 'app/redux/actions/follow';

// import { confirmUnfollowDialog } from 'app/redux/actions/dialogs';

import Follow from './Follow';

export default connect(
  () => ({
    username: 'who-is-it',
    isFollow: false,
  }),
  {
    updateFollow: () => {},
    confirmUnfollowDialog: () => {},
  }
)(Follow);
