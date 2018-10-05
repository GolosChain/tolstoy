import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';
import { USER_FOLLOW_DATA_LOAD } from 'src/app/redux/constants/followers';
import { FAVORITES_LOAD } from 'src/app/redux/constants/favorites';
import { PostContainer } from 'src/app/containers/post/PostContainer';
import { togglePinAction } from 'src/app/redux/actions/pinnedPosts';
import {toggleFavoriteAction} from 'src/app/redux/actions/favorites';

export default connect(
    createSelector(
        [currentPostSelector, authorSelector, currentUsernameSelector],
        (post, author, username) => {
            return {
                author: author.account,
                postLoaded: Boolean(post),
                isUserAuth: Boolean(username),
                isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
                permLink: post.permLink,
                isFavorite: post.isFavorite,
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
        togglePin: togglePinAction,
        toggleFavorite: (link, isAdd) => toggleFavoriteAction({ link, isAdd }),
    }
)(PostContainer);
