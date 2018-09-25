import transaction from '../../../../app/redux/Transaction';

export function updateFollow(follower, following, action, done) {
    return dispatch => {
        const what = action ? [action] : [];
        const json = ['follow', { follower, following, what }];
        dispatch(
            transaction.actions.broadcastOperation({
                type: 'custom_json',
                operation: {
                    id: 'follow',
                    required_posting_auths: [follower],
                    json: JSON.stringify(json),
                },
                successCallback: done,
                errorCallback: done,
            })
        );
    };
}
