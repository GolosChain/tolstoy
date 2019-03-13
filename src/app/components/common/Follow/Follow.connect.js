import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { currentUsernameSelector } from 'src/app/redux/selectors/common';
// import { followSelector } from 'src/app/redux/selectors/follow/follow';
// import { updateFollow } from 'src/app/redux/actions/follow';

// import { confirmUnfollowDialog } from 'src/app/redux/actions/dialogs';

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
