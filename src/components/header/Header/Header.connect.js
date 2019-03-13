import { connect } from 'react-redux';

import { currentUsernameSelector } from 'store/selectors/auth';
import { logout } from 'store/actions/gate/auth';
//import user from 'app/redux/User';
//import { getNotificationsOnlineHistoryFreshCount } from 'app/redux/actions/notificationsOnline';
//import { statusSelector } from 'app/redux/selectors/common';

import Header from './Header';

export default connect(
  state => {
    const currentUsername = currentUsernameSelector(state);

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
    getNotificationsOnlineHistoryFreshCount: () => {},
    logout,
  }
)(Header);
