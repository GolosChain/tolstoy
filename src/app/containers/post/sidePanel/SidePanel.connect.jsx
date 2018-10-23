import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { onVote } from 'src/app/redux/actions/vote';
import { SidePanel } from 'src/app/containers/post/sidePanel/SidePanel';
import {
    currentPostSelector,
    authorSelector,
    votesSummarySelector,
} from 'src/app/redux/selectors/post/commonPost';

export default connect(
    createSelector(
        [currentPostSelector, authorSelector, currentUsernameSelector, votesSummarySelector],
        (post, author, username, votesSummary) => {
            return {
                votesSummary,
                username,
                author: author.account,
                permLink: post.permLink,
                myVote: post.myVote,
                postUrl: post.url,
                isOwner: username === author.account,
                isFavorite: post.isFavorite,
                isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
            };
        }
    ),

    {
        onVote,
    }
)(SidePanel);
