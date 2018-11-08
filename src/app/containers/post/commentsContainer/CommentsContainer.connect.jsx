import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { routePostSelector, commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { fetchCommentsIfNeeded } from 'src/app/redux/actions/comments';
import { CommentsContainer } from 'src/app/containers/post/commentsContainer/CommentsContainer';
import { locationSelector } from 'src/app/redux/selectors/ui/location';
import { commentInputFocused } from '../../../redux/selectors/post/commonPost';

export default connect(
    createSelector(
        [routePostSelector, commentsSelector, locationSelector, commentInputFocused],
        (data, commentsData, location, commentInputFocused) => ({
            pathname: location.pathname,
            data,
            commentInputFocused,
            ...commentsData,
        })
    ),

    {
        fetchCommentsIfNeeded,
    }
)(CommentsContainer);
