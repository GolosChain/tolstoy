import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector, appSelector } from 'src/app/redux/selectors/common';
import { SidePanel } from 'src/app/containers/post/sidePanel/SidePanel';
import { onBackClick } from 'src/app/redux/actions/post';
import { onVote } from 'src/app/redux/actions/vote';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';

export default connect(
    createSelector(
        [currentPostSelector, authorSelector, currentUsernameSelector, appSelector('location')],
        (post, author, username, location) => {
            const prev = location.get('previous');
            let backURL = null;
            if (prev) {
                backURL = prev.get('pathname') + prev.get('search') + prev.get('hash');
            }

            return {
                post,
                username,
                backURL,
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
