import { call, takeEvery, select } from 'redux-saga/effects';

import { broadcast, ecc } from 'golos-js';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { getCurrentUserPrivateMemoKey } from 'src/messenger/redux/selectors/common';
import { findSigningKey } from 'app/redux/sagas/auth';
import { MESSENGER_BROADCAST_TRANSACTION } from 'src/messenger/redux/constants/transactions';

const __DEBUG__ = true;

export default function* watch() {
    yield takeEvery(MESSENGER_BROADCAST_TRANSACTION, broadcastCustomJson);
}

const hook = {
    preBroadcast_sendMessage,
};

function* preBroadcast_sendMessage({
    to,
    toMemokey,
    message,
}) {
    const from = yield select(currentUsernameSelector);

    const messageObj = {
        subject: '',
        body: message,
        app: 'golosio',
    };

    const memoPrivate = yield select(getCurrentUserPrivateMemoKey);

    if (!memoPrivate){
        // TODO
        throw new Error('Unable to encrypte message, missing memo private key');
    }

    const {
        nonce,
        from_memo_key,
        to_memo_key,
        checksum,
        encrypted_message,
    } = yield call(
        tryEncryptMessage,
        memoPrivate, 
        toMemokey,
        JSON.stringify(messageObj),
    );

    const operation = [
        'private_message',
        {
            from,
            to,
            nonce,
            from_memo_key,
            to_memo_key,
            checksum,
            update: false,
            encrypted_message,
        },
    ];

    return operation;
}

function* broadcastCustomJson({
    payload: {
        broadcastType,
        broadcastPayload,
        successCallback,
        errorCallback,
    }
}) {
    const operation = yield call(hook[`preBroadcast_${broadcastType}`], broadcastPayload);
    const currentUsername = yield select(currentUsernameSelector);

    const operations = [
        [
            'custom_json',
            {
                required_auths: [],
                required_posting_auths: [ currentUsername ],
                id: 'private_message',
                json: JSON.stringify(operation),
            }
        ]
    ];

    try {
        const signingKey = yield call(
            findSigningKey,
            {
                opType: 'custom_json',
                username: currentUsername,
            }
        );

        if (!signingKey) {
            // TODO ?
        }

        yield broadcast.sendAsync({ extensions: [], operations }, [ signingKey ]);
        if (successCallback) {
            successCallback();
        }

        if (__DEBUG__) console.warn(`${broadcastType} success`, operation)
    } catch (error) {
        if (errorCallback) {
            errorCallback();
        }

        if (__DEBUG__) console.error(error, operation)
    }
}

function* tryEncryptMessage(fromPrivateMemoKey, toPublicMemoKey, stringifyMessage, testNonce) {
    const { Aes, PrivateKey } = ecc;
    const fromPrivateKey = fromPrivateMemoKey.d ? fromPrivateMemoKey : PrivateKey.fromWif(fromPrivateMemoKey);
    const fromPublicKey = fromPrivateKey.toPublicKey().toString();

    const { nonce, message, checksum } = Aes.encrypt(fromPrivateKey, toPublicMemoKey, stringifyMessage, testNonce);

    return {
        nonce: nonce.toNumber(),
        from_memo_key: fromPublicKey,
        to_memo_key: toPublicMemoKey,
        checksum,
        encrypted_message: message.toString('hex'),
    };
}
