import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { fetchViewCount } from 'src/app/redux/actions/post';

import ViewCount from './ViewCount';

// const selector = createSelector(
//     [state => state.data.viewCount, (state, props) => props.postLink],
//     (viewCount, postLink) => {
//         const viewCountInfo = viewCount[postLink];
//
//         if (!viewCountInfo) {
//             return {};
//         }
//
//         return {
//             viewCount: viewCountInfo.viewCount,
//             timestamp: viewCountInfo.timestamp,
//         };
//     }
// );

export default connect(
    () => ({
        viewCount: 3,
    }),
    {
        fetchViewCount: () => {},
    }
)(ViewCount);
