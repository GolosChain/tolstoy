import { connect } from 'react-redux';

//import user from 'app/redux/User';
//import { getNotificationsOnlineHistoryFreshCount } from 'src/app/redux/actions/notificationsOnline';
//import { statusSelector } from 'src/app/redux/selectors/common';

import Header from './Header';

export default connect(
    state => {
        // TODO:
        //const currentUsername = state.user.getIn(['current', 'username']);
        const currentUsername = 'currentUsername';

        let votingPower = null;
        let realName = null;

        if (currentUsername) {
            // TODO:
            //votingPower = state.global.getIn(['accounts', currentUsername, 'voting_power']) / 100;
            votingPower = 50;

            realName = currentUsername;
        }

        // TODO:
        // const notificationsOnlineStatus = statusSelector('notificationsOnline')(state);

        return {
            freshCount: 3 /* notificationsOnlineStatus.get('freshCount') */,
            currentUsername,
            votingPower,
            realName,
            offchainAccount: null /* state.offchain.get('account') */,
        };
    },
    {
        // onLogin: () => user.actions.showLogin(),
        // onLogout: () => user.actions.logout(),
        getNotificationsOnlineHistoryFreshCount: () => {},
    }
)(Header);
