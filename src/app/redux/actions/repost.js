import transaction from 'app/redux/Transaction';

export const repost = ({ myAccountName, author, permLink, comment, onSuccess, onError }) => {
    const json = [
        'reblog',
        {
            account: myAccountName,
            author,
            permlink: permLink,
            title: '',
            body: comment,
            json_metadata: JSON.stringify({
                app: 'golos.io/0.1',
                format: 'text',
            }),
        },
    ];

    return transaction.actions.broadcastOperation({
        type: 'custom_json',
        operation: {
            id: 'follow',
            required_posting_auths: [myAccountName],
            json: JSON.stringify(json),
        },
        successCallback: onSuccess,
        errorCallback: onError,
    });
};
