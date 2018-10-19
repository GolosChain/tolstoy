import ByteBuffer from 'bytebuffer';
import { ecc } from 'golos-js';

const isJson = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

const addMeatadata = message => {
    const { create_date, receive_date, read_date, remove_date } = message;

    const status = read_date === '1970-01-01T00:00:00' ? 'sent' : 'viewed';
    const isEdited = receive_date !== create_date;
    const isRemoved = remove_date !== '1970-01-01T00:00:00';

    return {
        status,
        isEdited,
        isRemoved,
    };
};

const parseJsonMessage = json => {
    if (isJson(json)) {
        const messageObj = JSON.parse(json);
        return (typeof messageObj.body === 'string') ? messageObj.body : 'Error: object';
    } else {
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

        return Object.assign(
                {},
                message,
                {
                    type,
                    metadata,
                    message: messageText,
                }
            )
    });
};

export const tryDecryptMessage = (toPrivateMemoKey, fromPublickMemoKey, nonce, encrypted, check) => {
    const { Aes } = ecc;
    if (typeof nonce === 'number') {
        nonce = nonce.toString();
    }
    const enc = new Buffer(encrypted, 'hex');
    try {
        const message = Aes.decrypt(toPrivateMemoKey, fromPublickMemoKey, nonce, enc, check);
        const mbuf = ByteBuffer.fromBinary(message.toString('binary'), ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN);
        
        try {
            mbuf.mark();
            return mbuf.readVString();
        } catch(e) {
            mbuf.reset();
            return new  Buffer(mbuf.toString('binary'), 'binary').toString('utf-8');
        }
    } catch (error) {
        console.error(error);
        return 'Error: decrypt';
    }
};
