import { connect } from 'react-redux';

// import { followersDialogSelector } from 'src/app/redux/selectors/dialogs/followersDialog';
// import { getFollowers, getFollowing } from 'src/app/redux/actions/followers';

import FollowersDialog from './FollowersDialog';

export default connect(
    //followersDialogSelector,
    () => ({}),
    {
        getFollowers: () => {},
        getFollowing: () => {},
    }
)(FollowersDialog);
