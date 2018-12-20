import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchViewCount } from 'src/app/redux/actions/post';
import ViewCount from './ViewCount';

const selector = createSelector(
    [state => state.data.viewCount, (state, props) => props.postLink],
    (viewCount, postLink) => ({
        viewCount: viewCount[postLink],
    })
);

export default connect(
    selector,
    { fetchViewCount }
)(ViewCount);
