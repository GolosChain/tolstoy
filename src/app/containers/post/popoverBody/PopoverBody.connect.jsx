import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { authorSelector } from 'src/app/redux/selectors/post/commonPost';
import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { USER_PINNED_POSTS_LOAD } from 'src/app/redux/constants/pinnedPosts';
import { PopoverBody } from 'src/app/containers/post/popoverBody/PopoverBody';

export default connect(
    createSelector([authorSelector, currentUsernameSelector], (author, currentUsername) => ({
        account: author.account,
        name: author.name,
        about: author.about,
        followerCount: author.followerCount,
        pinnedPosts: author.pinnedPosts,
        pinnedPostsUrls: author.pinnedPostsUrls,
        showFollowBlock: author.name !== currentUsername,
    })),

    {
        toggleFavorite: (link, isAdd) => toggleFavoriteAction({ link, isAdd }),
        getPostContent: urls => ({
            type: USER_PINNED_POSTS_LOAD,
            payload: {
                urls,
            },
        }),
    }
)(PopoverBody);
