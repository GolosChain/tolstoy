import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { onVote } from 'src/app/redux/actions/vote';
import { reblog } from 'src/app/redux/actions/posts';
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
                isFavorite: post.isFavorite,
                author: author.account,
                permLink: post.permLink,
                myVote: post.myVote,
            };
        }
    ),

    {
        toggleFavorite: toggleFavoriteAction,
        onVote,
        reblog,
    }
)(SidePanel);
