import ByteBuffer from 'bytebuffer';
import { ecc } from 'mocks/golos-js';

import { EPOCH_TIME } from './constants';

const addMeatadata = message => {
    const { create_date, receive_date, read_date, remove_date } = message;

    const status = read_date === EPOCH_TIME ? 'sent' : 'viewed';
    const isEdited = receive_date !== create_date;
    const isRemoved = remove_date !== EPOCH_TIME;

    return {
        status,
        isEdited,
        isRemoved,
    };
};

const parseJsonMessage = json => {
    try {
        const messageObj = JSON.parse(json);
        if (typeof messageObj.body === 'string') {
            return messageObj.body;
        } else {
            return 'Error: object';
        }
    } catch (e) {
        return 'Error: JSON.parse';
    }
};

export const processMessages = (currentUserName, currentUserPrivateMemoKey, messages) => {
    return messages.reverse().map(message => {
        const type = message.from === currentUserName ? 'messageOut' : 'messageIn';

        const metadata = addMeatadata(message);

        const { to_memo_key, nonce, checksum, encrypted_message } = message;
        const jsonMessage = tryDecryptMessage(
            currentUserPrivateMemoKey,
            to_memo_key,
            nonce,
            encrypted_message,
            checksum
        );
        const messageText = parseJsonMessage(jsonMessage);

        return {
            ...message,
            type,
            metadata,
            message: messageText,
        };
    });
};

export const tryDecryptMessage = (
    toPrivateMemoKey,
    fromPublickMemoKey,
    nonce,
    encrypted,
    check
) => {
    const { Aes } = ecc;
    if (typeof nonce === 'number') {
        nonce = nonce.toString();
    }
    const enc = new Buffer(encrypted, 'hex');
    try {
        const message = Aes.decrypt(toPrivateMemoKey, fromPublickMemoKey, nonce, enc, check);
        const mbuf = ByteBuffer.fromBinary(
            message.toString('binary'),
            ByteBuffer.DEFAULT_CAPACITY,
            ByteBuffer.LITTLE_ENDIAN
        );

        try {
            mbuf.mark();
            return mbuf.readVString();
        } catch (e) {
            mbuf.reset();
            return new Buffer(mbuf.toString('binary'), 'binary').toString('utf-8');
        }
    } catch (error) {
        console.error(error);
        return 'Error: decrypt';
    }
};
