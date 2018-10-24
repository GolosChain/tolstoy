import tt from 'counterpart';

import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';
import { SHOW_VOTED_USERS } from 'src/app/redux/constants/votedUsers';

export function onVote(voter, author, permLink, percent) {
    return dispatch => {
        dispatch(
            transaction.actions.broadcastOperation({
                type: 'vote',
                operation: {
                    voter,
                    author,
                    permlink: permLink,
                    weight: Math.round(percent * 10000),
                    __config: {
                        title: percent < 0 ? tt('voting_jsx.confirm_flag') : null,
                    },
                },
                successCallback: () => dispatch(user.actions.getAccount()),
            })
        );
    };
}

export function showVotedUsersList(postLink, isLikes) {
    return {
        type: SHOW_VOTED_USERS,
        postLink,
        isLikes,
    };
}
