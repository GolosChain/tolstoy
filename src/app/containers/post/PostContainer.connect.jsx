import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector, newVisitorSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';
import { USER_FOLLOW_DATA_LOAD } from 'src/app/redux/constants/followers';
import { PostContainer } from 'src/app/containers/post/PostContainer';
import { togglePin } from 'src/app/redux/actions/pinnedPosts';
import { toggleFavorite } from 'src/app/redux/actions/favorites';

export default connect(
    createSelector(
        [currentPostSelector, authorSelector, currentUsernameSelector, newVisitorSelector],
        (post, author, username, newVisitor) => {
            if (!post) {
                return {};
            }

            return {
                newVisitor: newVisitor,
                author: author.account,
                postLoaded: Boolean(post),
                isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
                permLink: post.permLink,
                isFavorite: post.isFavorite,
                isOwner: username === author.account,
                stats: post.stats,
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
        togglePin,
        toggleFavorite,
    }
)(PostContainer);
