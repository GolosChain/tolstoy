import transaction from 'app/redux/Transaction';
import tt from 'counterpart';

export function reblog(
    account,
    author,
    permlink,
    successCallback = () => {},
    errorCallback = () => {}
) {
    return dispatch => {
        const json = ['reblog', { account, author, permlink }];
        dispatch(
            transaction.actions.broadcastOperation({
                type: 'custom_json',
                confirm: tt('g.are_you_sure'),
                operation: {
                    id: 'follow',
                    required_posting_auths: [account],
                    json: JSON.stringify(json),
                    __config: { title: tt('g.resteem_this_post') },
                },
                successCallback,
                errorCallback,
            })
        );
    };
}
