import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Map, List } from 'immutable';

import { currentUsernameSelector, appSelector } from 'src/app/redux/selectors/common';
import { SidePanel } from 'src/app/containers/post/sidePanel/SidePanel';
import { onBackClick } from 'src/app/redux/actions/post';
import { onVote } from 'src/app/redux/actions/vote';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';

export default connect(
    createSelector(
        [currentPostSelector, authorSelector, currentUsernameSelector, appSelector('location')],
        (post, author, username, location) => {
            return {
                post,
                username,
                contentLink: `${author.account}/${post.permLink}`,
                isOwner: username === author.account,
                backURL: location.getIn(['previous', 'pathname']).replace(/(.+)\?.+/, '$1'),
                isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
            };
        }
    ),
    {
        onVote,
        onBackClick,
    }
)(SidePanel);
