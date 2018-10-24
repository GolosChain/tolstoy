import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { onVote, showVotedUsersList } from 'src/app/redux/actions/vote';
import { togglePinAction } from 'src/app/redux/actions/pinnedPosts';
import { ActivePanel } from 'src/app/containers/post/activePanel/ActivePanel';
import { openPromoteDialog, openRepostDialog } from 'src/app/redux/actions/dialogs';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import {
    authorSelector,
    currentPostSelector,
    votesSummarySelector,
    routePostSelector,
} from 'src/app/redux/selectors/post/commonPost';

export default connect(
    createSelector(
        [
            currentPostSelector,
            authorSelector,
            currentUsernameSelector,
            votesSummarySelector,
            routePostSelector,
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
        togglePinAction,
        showVotedUsersList,
        openPromoteDialog,
        openRepostDialog,
    }
)(ActivePanel);
