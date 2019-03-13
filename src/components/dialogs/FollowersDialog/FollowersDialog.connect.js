import { connect } from 'react-redux';

// import { followersDialogSelector } from 'app/redux/selectors/dialogs/followersDialog';
// import { getFollowers, getFollowing } from 'app/redux/actions/followers';

import FollowersDialog from './FollowersDialog';

export default connect(
  //followersDialogSelector,
  () => ({}),
  {
    getFollowers: () => {},
    getFollowing: () => {},
  }
)(FollowersDialog);
