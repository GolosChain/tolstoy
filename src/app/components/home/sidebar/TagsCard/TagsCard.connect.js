import { connect } from 'react-redux';
import { List, Map } from 'immutable';

import constants from 'app/redux/constants';
import { IGNORE_TAGS } from 'app/client_config';
import { changeHomeTagsCardCollapse } from 'src/app/redux/actions/ui';
import { saveTag } from 'src/app/redux/actions/tags';
import {
    createDeepEqualSelector,
    uiSelector,
    dataSelector,
    currentUsernameSelector,
    globalSelector,
    routeParamSelector,
} from 'src/app/redux/selectors/common';
import { COUNT_OF_TAGS } from 'src/app/redux/constants/common';

import TagsCard from './TagsCard';

const emptyList = List();

export default connect(
    createDeepEqualSelector(
        [
            uiSelector('home'),
            dataSelector('settings'),
            currentUsernameSelector,
            globalSelector(['tag_idx', 'trending'], emptyList),
            routeParamSelector('category', ''),
            routeParamSelector('order', constants.DEFAULT_SORT_ORDER),
        ],
        (uiHome, settings, currentUsername, trendingTags, category, order) => {
            if (category === 'feed') {
                category = '';
                order = 'feed';
            }

            const collapsed = uiHome.get('tagsCollapsed');

            const tags = trendingTags
                // filter wrong tags
                .map(tag => {
                    if (/^(u\w{4}){6,}/.test(tag)) {
                        return null;
                    }
                    return tag;
                })
                // filter ignore tags and wrong tags
                .filter(tag => tag !== null && !IGNORE_TAGS.includes(tag))
                // take only nedeed count of tags
                .take(collapsed ? COUNT_OF_TAGS.COLLAPSED : COUNT_OF_TAGS.EXPANDED);

            return {
                category,
                order,
                tags,
                currentUsername,
                selectedTags: settings.getIn(['basic', 'selectedTags'], Map()),
                collapsed,
                order,
            };
        }
    ),
    {
        loadMore: payload => ({ type: 'REQUEST_DATA', payload }),
        changeHomeTagsCardCollapse,
        saveTag,
    }
)(TagsCard);
