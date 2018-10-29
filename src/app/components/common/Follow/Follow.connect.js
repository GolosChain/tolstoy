import { connect } from 'react-redux';

import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { followSelector } from 'src/app/redux/selectors/follow/follow';
import { updateFollow } from 'src/app/redux/actions/follow';

import Follow from './Follow';

export default connect(
    createDeepEqualSelector(
        [currentUsernameSelector, followSelector],
        (username, { isFollow }) => ({
            username,
            isFollow,
        })
    ),
    (dispatch, { following }) => ({
        updateFollow: (follower, action) => {
            dispatch(updateFollow(follower, following, action));
        },
    })
)(Follow);
