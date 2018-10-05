import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { onVote } from 'src/app/redux/actions/vote';
import { reblog } from 'src/app/redux/actions/posts';
import { ActivePanel } from 'src/app/containers/post/activePanel/ActivePanel';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import {
    authorSelector,
    currentPostSelector,
    votesSummarySelector,
    postSelector,
} from 'src/app/redux/selectors/post/commonPost';

export default connect(
    createSelector(
        [
            currentPostSelector,
            authorSelector,
            currentUsernameSelector,
            votesSummarySelector,
            postSelector,
        ],
        (post, author, username, votesSummary, data) => ({
            votesSummary,
            data,
            username,
            permLink: post.permLink,
            account: author.account,
            isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
            children: post.children,
            url: post.url,
            isOwner: username === author.account,
            isFavorite: post.isFavorite,
        })
    ),

    {
        onVote,
        reblog,
        showPromotePost: (author, permlink) => ({
            type: 'global/SHOW_DIALOG',
            payload: { name: 'promotePost', params: { author, permlink } },
        }),
    }
)(ActivePanel);
