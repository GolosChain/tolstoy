import { connect } from 'react-redux';

import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { followSelector } from 'src/app/redux/selectors/follow/follow';
import { updateFollow } from 'src/app/redux/actions/follow';

import Follow from './Follow';
import { confirmUnfollowDialog } from 'src/app/redux/actions/dialogs';

export default connect(
    createDeepEqualSelector(
        [currentUsernameSelector, followSelector],
        (username, { isFollow }) => ({
            username,
            isFollow,
        })
    ),
    {
        updateFollow,
        confirmUnfollowDialog,
    }
)(Follow);
