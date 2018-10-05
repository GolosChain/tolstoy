import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';
import { USER_FOLLOW_DATA_LOAD } from 'src/app/redux/constants/followers';
import { FAVORITES_LOAD } from 'src/app/redux/constants/favorites';
import { PostContainer } from 'src/app/containers/post/PostContainer';

export default connect(
    createSelector(
        [currentPostSelector, authorSelector, currentUsernameSelector],
        (post, author, username) => {
            return {
                account: author.account,
                postLoaded: Boolean(post),
                isUserAuth: Boolean(username),
            };
        }
    ),

    {
        loadUserFollowData: username => ({
            type: USER_FOLLOW_DATA_LOAD,
            payload: {
                username,
            },
        }),
        loadFavorites: () => ({
            type: FAVORITES_LOAD,
            payload: {},
        }),
    }
)(PostContainer);
