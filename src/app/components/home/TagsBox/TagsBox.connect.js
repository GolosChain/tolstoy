import { connect } from 'react-redux';
import { Map } from 'immutable';

import constants from 'app/redux/constants';
import {
    createDeepEqualSelector,
    dataSelector,
    routeParamSelector,
} from 'src/app/redux/selectors/common';
import { setSettingsOptions } from 'src/app/redux/actions/settings';
import { TAGS_FILTER_TYPE_SELECT, TAGS_FILTER_TYPE_EXCLUDE } from 'src/app/redux/constants/common';

import TagsBox from './TagsBox';

export default connect(
    createDeepEqualSelector(
        [
            dataSelector('settings'),
            routeParamSelector('category', ''),
            routeParamSelector('order', constants.DEFAULT_SORT_ORDER),
        ],
        (settings, category, order) => {
            if (category === 'feed') {
                order = 'by_feed';
            }

            const selectedTags = settings.getIn(['basic', 'selectedTags'], Map());
            return {
                order,
                selectedTags,
                selectedSelectTags: selectedTags
                    .filter(tag => tag === TAGS_FILTER_TYPE_SELECT)
                    .keySeq()
                    .toArray(),
                selectedFilterTags: selectedTags
                    .filter(tag => tag === TAGS_FILTER_TYPE_EXCLUDE)
                    .keySeq()
                    .toArray(),
            };
        }
    ),
    dispatch => ({
        loadMore: payload => dispatch({ type: 'REQUEST_DATA', payload }),
        setSettingsOptions: payload => dispatch(setSettingsOptions(payload)),
    })
)(TagsBox);
