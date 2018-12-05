import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { SidePanel } from 'src/app/containers/post/sidePanel/SidePanel';
import { onBackClick } from 'src/app/redux/actions/post';
import { onVote } from 'src/app/redux/actions/vote';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';

export default connect(
    createSelector(
        [currentPostSelector, authorSelector, currentUsernameSelector],
        (post, author, username) => {
            return {
                post,
                username,
                contentLink: `${author.account}/${post.permLink}`,
                isOwner: username === author.account,
                isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
            };
        }
    ),
    {
        onVote,
        onBackClick,
    }
)(SidePanel);
