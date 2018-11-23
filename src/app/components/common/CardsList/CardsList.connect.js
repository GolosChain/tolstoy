import { connect } from 'react-redux';

import {
    createDeepEqualSelector,
    uiSelector,
    globalSelector,
    currentUsernameSelector,
} from 'src/app/redux/selectors/common';
import { saveListScrollPosition } from 'src/app/redux/actions/ui';
import { locationSelector } from 'src/app/redux/selectors/app/location';

import CardsList from './CardsList';

const ignoreResultSelector = createDeepEqualSelector(
    [globalSelector('follow'), currentUsernameSelector],
    (follow, currentUsername) =>
        follow && follow.getIn(['getFollowingAsync', currentUsername, 'ignore_result'])
);

export default connect(
    createDeepEqualSelector(
        [locationSelector, uiSelector('common'), ignoreResultSelector],
        (location, uiCommon, ignoreResult) => ({
            location,
            listScrollPosition: uiCommon.get('listScrollPosition'),
            backClickTs: uiCommon.get('backClickTs'),
            ignoreResult,
        })
    ),
    {
        saveListScrollPosition,
    }
)(CardsList);
