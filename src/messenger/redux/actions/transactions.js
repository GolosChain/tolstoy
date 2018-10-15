import { MESSENGER_BROADCAST_TRANSACTION } from 'src/messenger/redux/constants/transactions';

export const sendMessage = (
    to,
    toMemokey,
    message,
    successCallback,
    errorCallback,
) => ({
    type: MESSENGER_BROADCAST_TRANSACTION,
    payload: {
        broadcastType: 'sendMessage',
        broadcastPayload: {
            to,
            toMemokey,
            message,
        },
        successCallback,
        errorCallback,
    },
});
