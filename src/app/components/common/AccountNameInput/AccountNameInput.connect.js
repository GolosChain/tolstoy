import { connect } from 'react-redux';

import {
    createDeepEqualSelector,
    globalSelector,
    currentUsernameSelector,
    currentAccountSelector,
} from 'src/app/redux/selectors/common';
import AccountNameInput from './AccountNameInput';

export default connect(
    createDeepEqualSelector(
        [globalSelector('follow'), currentUsernameSelector, currentAccountSelector],
        (follow, currentUsername, user) => ({
            following: follow.getIn(['getFollowingAsync', currentUsername, 'blog_result']),
            transferHistory: user.get('transfer_history'),
        })
    ),
    {
        fetchTransferHistory: () => ({
            type: 'FETCH_CURRENT_USER_TRANSFERS',
            payload: {},
        }),
    }
)(AccountNameInput);
