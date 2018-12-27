import { connect } from 'react-redux';

import { getGateSocket } from 'src/app/helpers/gate';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';

import OnlineStatus from './OnlineStatus';

const currentRequests = {};

export default connect(
    (state, props) => ({
        isOwner: currentUsernameSelector(state) === props.username,
    }),
    {
        fetchUserLastOnline: (username, callback) => async () => {
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
        },
    }
)(OnlineStatus);
