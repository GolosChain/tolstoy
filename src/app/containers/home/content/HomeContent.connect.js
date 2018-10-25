import { connect } from 'react-redux';
import { Map } from 'immutable';

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
import { TAGS_FILTER_TYPES } from 'src/app/redux/constants/common';

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
                const selectedTags = settings.getIn(['basic', 'selectedTags'], Map());
                const selectedSelectTags = selectedTags
                    .filter(tag => tag === TAGS_FILTER_TYPES.SELECT)
                    .keySeq()
                    .sort()
                    .join('/');
                const selectedFilterTags = selectedTags
                    .filter(tag => tag === TAGS_FILTER_TYPES.EXCLUDE)
                    .keySeq()
                    .sort()
                    .join('/');

                let joinedTags = selectedSelectTags;
                if (selectedFilterTags) {
                    joinedTags = joinedTags.concat('|', selectedFilterTags);
                }

                posts = discussions.getIn([category || joinedTags, order]);
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
    {
        loadMore: params => ({ type: 'REQUEST_DATA', payload: params }),
    }
)(HomeContent);
