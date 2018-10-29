import tt from 'counterpart';

import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';
import { GET_VOTERS_USERS_REQUEST } from 'src/app/redux/constants/voters';

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

export function getVoters(postLink, limit = -1) {
    return {
        type: GET_VOTERS_USERS_REQUEST,
        payload: {
            postLink,
            limit,
        },
    };
}
