import { connect } from 'react-redux';

// import constants from 'app/store/constants';
// import {
//     createDeepEqualSelector,
//     currentUsernameSelector,
//     routeParamSelector,
// } from 'app/redux/selectors/common';
// import { locationTagsSelector } from 'app/redux/selectors/app/location';
// import { deleteTag } from 'app/redux/actions/tags';

import TagsBox from './TagsBox';

export default connect(
  // createDeepEqualSelector(
  //     [
  //         currentUsernameSelector,
  //         routeParamSelector('category', ''),
  //         routeParamSelector('order', constants.DEFAULT_SORT_ORDER),
  //         locationTagsSelector,
  //     ],
  //     (currentUsername, category, order, { tagsSelect, tagsFilter }) => {
  //         if (category === 'feed') {
  //             category = '';
  //             order = 'feed';
  //         }
  //
  //         return {
  //             category,
  //             order,
  //             currentUsername,
  //             tagsSelect,
  //             tagsFilter,
  //         };
  //     }
  // ),
  () => ({
    category: '',
    order: '',
    currentUsername: 'currentUsername',
    tagsSelect: [],
    tagsFilter: [],
  }),
  {
    loadMore: payload => ({ type: 'REQUEST_DATA', payload }),
    deleteTag: () => {},
  }
)(TagsBox);