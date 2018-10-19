import { connect } from 'react-redux';

import constants from 'app/redux/constants';
import {
    createDeepEqualSelector,
    globalSelector,
    appSelector,
    userSelector,
    offchainSelector,
    dataSelector,
    uiSelector,
} from 'src/app/redux/selectors/common';

import HomeContent from './HomeContent';

const DEFAULT_LAYOUT = 'list';

const currentUsernameSelector = createDeepEqualSelector(
    [userSelector(['current', 'username']), offchainSelector('account')],
    (currentUsername, currentUsernameOffchain) => currentUsername || currentUsernameOffchain
);

export default connect(
    createDeepEqualSelector(
        [
            globalSelector('status'),
            appSelector('loading'),
            globalSelector('fetching'),

            globalSelector('discussion_idx'),
            globalSelector('accounts'),
            uiSelector(['profile', 'layout'], DEFAULT_LAYOUT),
            dataSelector('settings'),
            currentUsernameSelector,
            (_, props) => props.routeParams,
        ],
        (
            globalStatus,
            loading,
            fetching,
            discussions,
            accounts,
            layout,
            settings,
            currentUsername,
            { category = '', order = constants.DEFAULT_SORT_ORDER }
        ) => {
            let posts = null;

            if (category === 'feed') {
                const pageAccountName = order.slice(1);
                posts = accounts.getIn([pageAccountName, 'feed']);
                order = 'by_feed';
            } else {
                let select_tags = settings.getIn(['basic', 'selectedSelectTags']);
                if (select_tags && select_tags.size) {
                    select_tags = select_tags.sort().join('/');
                } else {
                    select_tags = '';
                }
                posts = discussions.getIn([category || select_tags, order]);
            }

            const status = globalStatus && globalStatus.getIn([category, order], null);
            const isFetching = (status && status.fetching) || loading || fetching || false;

            return {
                posts,
                currentUsername,
                isFetching,
                category,
                order,
                layout,
            };
        }
    ),
    dispatch => ({
        loadMore(params) {
            dispatch({ type: 'REQUEST_DATA', payload: params });
        },
    })
)(HomeContent);
