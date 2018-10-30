import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { routePostSelector, commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { fetchCommentsIfNeeded } from 'src/app/redux/actions/comments';
import { CommentsContainer } from 'src/app/containers/post/commentsContainer/CommentsContainer';
import { locationSelector } from 'src/app/redux/selectors/ui/location';

export default connect(
    createSelector(
        [routePostSelector, commentsSelector, locationSelector],
        (data, commentsData, location) => ({
            pathname: location.pathname,
            data,
            ...commentsData,
        })
    ),

    {
        fetchCommentsIfNeeded,
    }
)(CommentsContainer);
