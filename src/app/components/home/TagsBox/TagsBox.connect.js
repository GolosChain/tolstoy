import { connect } from 'react-redux';

import constants from 'app/redux/constants';
import {
    createDeepEqualSelector,
    dataSelector,
    routeParamSelector,
} from 'src/app/redux/selectors/common';
import { setSettingsOptions } from 'src/app/redux/actions/settings';

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

            return {
                selectedSelectTags: settings.getIn(['basic', 'selectedSelectTags']),
                selectedFilterTags: settings.getIn(['basic', 'selectedFilterTags']),
                order,
            };
        }
    ),
    dispatch => ({
        loadMore: payload => dispatch({ type: 'REQUEST_DATA', payload }),
        setSettingsOptions: payload => dispatch(setSettingsOptions(payload)),
    })
)(TagsBox);
