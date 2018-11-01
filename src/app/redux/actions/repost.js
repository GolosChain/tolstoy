import transaction from 'app/redux/Transaction';

export const repost = ({ myAccountName, author, permLink, comment, onSuccess, onError }) => {
    const operationJson = {
        account: myAccountName,
        author,
        permlink: permLink,
    };

    if (comment) {
        operationJson.title = '';
        operationJson.body = comment;
        operationJson.json_metadata = JSON.stringify({
            app: 'golos.io/0.1',
            format: 'text',
        });
    }

    return transaction.actions.broadcastOperation({
        type: 'custom_json',
        operation: {
            id: 'follow',
            required_posting_auths: [myAccountName],
            json: JSON.stringify(['reblog', operationJson]),
        },
        successCallback: onSuccess,
        errorCallback: onError,
    });
};
