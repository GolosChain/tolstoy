import { connect } from 'react-redux';
import { Map } from 'immutable';

import normalizeProfile from 'app/utils/NormalizeProfile';

import user from 'app/redux/User';
import {
    getNotificationsOnlineHistoryFreshCount,
    getNotificationsOnlineHistory,
} from 'src/app/redux/actions/notificationsOnline';
import { statusSelector } from 'src/app/redux/selectors/common';

import Header from './Header';

const emptyMap = Map();

export default connect(
    state => {
        const currentUsername = state.user.getIn(['current', 'username']);

        let votingPower = null,
            realName = null;

        if (currentUsername) {
            votingPower = state.global.getIn(['accounts', currentUsername, 'voting_power']) / 100;

            const userData = state.global.getIn(['accounts', currentUsername]) || emptyMap;
            const jsonData = normalizeProfile({
                json_metadata: userData.get('json_metadata'),
                name: currentUsername,
            });
            realName = jsonData.name || currentUsername;
        }

        const notificationsOnlineStatus = statusSelector('notificationsOnline')(state);

        return {
            freshCount: notificationsOnlineStatus.get('freshCount'),
            currentUsername,
            votingPower,
            realName,
            offchainAccount: state.offchain.get('account'),
        };
    },
    {
        onLogin: () => user.actions.showLogin(),
        onLogout: () => user.actions.logout(),
        getNotificationsOnlineHistoryFreshCount,
        getNotificationsOnlineHistory,
    }
)(Header);
