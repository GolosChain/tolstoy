import { connect } from 'react-redux';
import { createSelector } from 'reselect';

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
            post,
            data,
            username,
            permLink: post.permLink,
            account: author.account,
            isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
            isOwner: username === author.account,
        })
    ),
    {
        openPromoteDialog,
        openRepostDialog,
    }
)(ActivePanel);
