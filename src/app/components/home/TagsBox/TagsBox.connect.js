import { connect } from 'react-redux';
import { Map } from 'immutable';

import constants from 'app/redux/constants';
import {
    createDeepEqualSelector,
    dataSelector,
    currentUsernameSelector,
    routeParamSelector,
} from 'src/app/redux/selectors/common';
import { deleteTag, clearTags } from 'src/app/redux/actions/tags';
import { TAGS_FILTER_TYPES } from 'src/app/redux/constants/common';

import TagsBox from './TagsBox';

export default connect(
    createDeepEqualSelector(
        [
            dataSelector('settings'),
            currentUsernameSelector,
            routeParamSelector('category', ''),
            routeParamSelector('order', constants.DEFAULT_SORT_ORDER),
        ],
        (settings, currentUsername, category, order) => {
            if (category === 'feed') {
                category = '';
                order = 'feed';
            }

            const selectedTags = settings.getIn(['basic', 'selectedTags'], Map());
            return {
                category,
                order,
                currentUsername,
                selectedSelectTags: selectedTags
                    .filter(tag => tag === TAGS_FILTER_TYPES.SELECT)
                    .keySeq()
                    .toArray(),
                selectedFilterTags: selectedTags
                    .filter(tag => tag === TAGS_FILTER_TYPES.EXCLUDE)
                    .keySeq()
                    .toArray(),
            };
        }
    ),
    {
        loadMore: payload => ({ type: 'REQUEST_DATA', payload }),
        deleteTag,
        clearTags,
    }
)(TagsBox);
