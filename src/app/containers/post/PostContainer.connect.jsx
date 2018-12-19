import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector, currentUserSelector } from 'src/app/redux/selectors/common';
import { locationTagsSelector } from 'src/app/redux/selectors/app/location';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';
import { PostContainer } from 'src/app/containers/post/PostContainer';
import { togglePin } from 'src/app/redux/actions/pinnedPosts';
import { toggleFavorite } from 'src/app/redux/actions/favorites';
import { isHide, isContainTags } from 'app/utils/StateFunctions';
import { HIDE_BY_TAGS } from 'src/app/constants/tags';

export default connect(
    createSelector(
        [
            currentPostSelector,
            authorSelector,
            currentUsernameSelector,
            currentUserSelector,
            locationTagsSelector,
        ],
        (post, author, username, user, { tagsSelect }) => {
            if (!post) {
                return {};
            }

            return {
                author: author.account,
                postLoaded: Boolean(post),
                isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
                permLink: post.permLink,
                isFavorite: post.isFavorite,
                isOwner: username === author.account,
                stats: post.stats,
                isHidden:
                    isHide(post) ||
                    post.isEmpty ||
                    (username !== author.account &&
                        isContainTags(post, HIDE_BY_TAGS) &&
                        !tagsSelect.length),
                user,
            };
        }
    ),

    {
        togglePin,
        toggleFavorite,
    }
)(PostContainer);
