import { connect } from 'react-redux';

//import constants from 'app/store/constants';
// import {
//     createDeepEqualSelector,
//     globalSelector,
//     appSelector,
//     currentUsernameSelector,
//     uiSelector,
// } from 'app/redux/selectors/common';
// import { locationTagsSelector } from 'app/redux/selectors/app/location';

import HomeContent from './HomeContent';

const DEFAULT_LAYOUT = 'list';

export default connect(
  // createDeepEqualSelector(
  //     [
  //         globalSelector('status'),
  //         appSelector('loading'),
  //         globalSelector('fetching'),
  //         globalSelector('discussion_idx'),
  //         uiSelector('profile', 'layout', DEFAULT_LAYOUT),
  //         currentUsernameSelector,
  //         locationTagsSelector,
  //         (_, props) => props.routeParams,
  //     ],
  //     (
  //         globalStatus,
  //         loading,
  //         fetching,
  //         discussions,
  //         layout,
  //         currentUsername,
  //         { tagsStr },
  //         { category = '', order = constants.DEFAULT_SORT_ORDER }
  //     ) => {
  //         if (category === 'feed') {
  //             category = '';
  //             order = 'feed';
  //         }
  //
  //         const posts = discussions.getIn([tagsStr, order]);
  //
  //         const status = globalStatus && globalStatus.getIn([tagsStr, order], null);
  //         const isFetching = (status && status.fetching) || loading || fetching || false;
  //
  //         return {
  //             posts,
  //             currentUsername,
  //             isFetching,
  //             category,
  //             order,
  //             layout,
  //             tagsStr,
  //         };
  //     }
  // ),
  () => ({
    posts: [],
    currentUsername: 'currentUsername',
    isFetching: false,
    category: 'lol',
    order: '',
    layout: DEFAULT_LAYOUT,
    tagsStr: '',
  }),
  {
    loadMore: payload => ({ type: 'REQUEST_DATA', payload }),
  }
)(HomeContent);
