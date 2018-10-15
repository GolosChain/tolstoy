import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { postSelector, commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { fetchCommentsIfNeeded } from 'src/app/redux/actions/comments';
import { CommentsContainer } from 'src/app/containers/post/commentsContainer/CommentsContainer';

export default connect(
    createSelector(
        [postSelector, commentsSelector],
        (data, commentsData) => {
            return {
                data,
                ...commentsData,
            };
        }
    ),

    {
        fetchCommentsIfNeeded,
    }
)(CommentsContainer);
