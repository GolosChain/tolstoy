import { connect } from 'react-redux';

import { FORCE_POST } from 'app/client_config';
import constants from 'app/redux/constants';
import {
    createDeepEqualSelector,
    globalSelector,
    appSelector,
    currentUsernameSelector,
    uiSelector,
} from 'src/app/redux/selectors/common';
import { locationTagsSelector } from 'src/app/redux/selectors/app/location';

import HomeContent from './HomeContent';

const DEFAULT_LAYOUT = 'list';

export default connect(
    createDeepEqualSelector(
        [
            globalSelector('status'),
            appSelector('loading'),
            globalSelector('fetching'),
            globalSelector('discussion_idx'),
            uiSelector('profile', 'layout', DEFAULT_LAYOUT),
            currentUsernameSelector,
            locationTagsSelector,
            (_, props) => props.routeParams,
        ],
        (
            globalStatus,
            loading,
            fetching,
            discussions,
            layout,
            currentUsername,
            { tagsStr },
            { category = '', order = constants.DEFAULT_SORT_ORDER }
        ) => {
            if (category === 'feed') {
                category = '';
                order = 'feed';
            }

            let posts = discussions.getIn([tagsStr, order]);

            if (posts) {
                posts = posts.filter(url => url !== FORCE_POST.url).unshift(FORCE_POST.url);
            }

            const status = globalStatus && globalStatus.getIn([tagsStr, order], null);
            const isFetching = (status && status.fetching) || loading || fetching || false;

            return {
                posts,
                currentUsername,
                isFetching,
                category,
                order,
                layout,
                tagsStr,
            };
        }
    ),
    {
        loadMore: payload => ({ type: 'REQUEST_DATA', payload }),
    }
)(HomeContent);
