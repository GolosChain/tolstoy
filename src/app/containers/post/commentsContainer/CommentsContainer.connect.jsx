import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { postSelector, commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { fetchCommentsIfNeeded } from 'src/app/redux/actions/comments';
import { CommentsContainer } from 'src/app/containers/post/commentsContainer/CommentsContainer';

export default connect(
    createSelector(
        [postSelector, currentUsernameSelector, commentsSelector],
        (data, username, comments) => {
            return {
                data,
                username,
                ...comments,
            };
        }
    ),

    {
        fetchCommentsIfNeeded,
    }
)(CommentsContainer);
