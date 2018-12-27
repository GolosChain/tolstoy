import { getGateSocket } from 'src/app/helpers/gate';

const currentRequests = {};

export function fetchUserLastOnline(username, callback) {
    return async () => {
        const gate = await getGateSocket();

        let currentRequest = currentRequests[username];

        if (!currentRequest) {
            currentRequest = gate.call('meta.getUserLastOnline', {
                user: username,
            });

            await currentRequest;
            delete currentRequests[username];
        }

        const { lastOnlineAt } = await currentRequest;

        callback(lastOnlineAt);
    };
}
