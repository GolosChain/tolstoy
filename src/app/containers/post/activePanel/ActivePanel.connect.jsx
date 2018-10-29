import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { togglePinAction } from 'src/app/redux/actions/pinnedPosts';
import { ActivePanel } from 'src/app/containers/post/activePanel/ActivePanel';
import { openPromoteDialog, openRepostDialog } from 'src/app/redux/actions/dialogs';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import {
    authorSelector,
    currentPostSelector,
    routePostSelector,
} from 'src/app/redux/selectors/post/commonPost';

export default connect(
    createSelector(
        [currentPostSelector, authorSelector, currentUsernameSelector, routePostSelector],
        (post, author, username, data) => ({
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
        togglePinAction,
        openPromoteDialog,
        openRepostDialog,
    }
)(ActivePanel);
