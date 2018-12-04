import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector, newVisitorSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';
import { USER_FOLLOW_DATA_LOAD } from 'src/app/redux/constants/followers';
import { PostContainer } from 'src/app/containers/post/PostContainer';
import { togglePin } from 'src/app/redux/actions/pinnedPosts';
import { toggleFavorite } from 'src/app/redux/actions/favorites';
import { isHide, hideByTags } from 'app/utils/StateFunctions';
import { HIDE_BY_TAGS } from 'src/app/constants/tags';

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
                isHidden: isHide(post),
                isHiddenByTags: hideByTags(post, HIDE_BY_TAGS),
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
