import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import constants from 'src/app/store/constants';
// import { IGNORE_TAGS } from 'src/app/client_config';
// import { changeHomeTagsCardCollapse } from 'src/app/redux/actions/ui';
// import { saveTag } from 'src/app/redux/actions/tags';
// import {
//     createDeepEqualSelector,
//     uiSelector,
//     currentUsernameSelector,
//     globalSelector,
//     routeParamSelector,
// } from 'src/app/redux/selectors/common';
// import { locationTagsSelector } from 'src/app/redux/selectors/app/location';
// import { COUNT_OF_TAGS } from 'src/app/redux/constants/common';

import TagsCard from './TagsCard';

export default connect(
  createSelector(
    [
      // uiSelector('home'),
      // currentUsernameSelector,
      // globalSelector(['tag_idx', 'trending'], emptyList),
      // routeParamSelector('category', ''),
      // routeParamSelector('order', constants.DEFAULT_SORT_ORDER),
      // locationTagsSelector,
    ],
    (/* uiHome, currentUsername, trendingTags, category, order, { tagsSelect, tagsFilter } */) => {
      // if (category === 'feed') {
      //     category = '';
      //     order = 'feed';
      // }
      //
      // const collapsed = uiHome.get('tagsCollapsed');
      //
      // const tags = trendingTags
      //     // filter wrong tags
      //     .map(tag => {
      //         if (/^(u\w{4}){6,}/.test(tag)) {
      //             return null;
      //         }
      //         return tag;
      //     })
      //     // filter ignore tags and wrong tags
      //     .filter(tag => tag !== null && !IGNORE_TAGS.includes(tag))
      //     // take only nedeed count of tags
      //     .take(collapsed ? COUNT_OF_TAGS.COLLAPSED : COUNT_OF_TAGS.EXPANDED);

      return {
        category: 'feed',
        order: '',
        tags: [],
        currentUsername: 'currentUsername',
        tagsSelect: [],
        tagsFilter: [],
        collapsed: true,
      };
    }
  ),
  {
    loadMore: payload => ({ type: 'REQUEST_DATA', payload }),
    changeHomeTagsCardCollapse: () => {},
    saveTag: () => {},
  }
)(TagsCard);
