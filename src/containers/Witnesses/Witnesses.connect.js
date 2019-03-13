import { connect } from 'react-redux';

import transaction from 'app/redux/Transaction';
import { loginIfNeed } from 'src/app/redux/actions/login';
import { Witnesses } from 'src/containers/Witnesses/Witnesses';

export default connect(
  state => {
    const currentUser = state.user.get('current');
    const username = currentUser && currentUser.get('username');
    const currentAccount = currentUser && state.global.getIn(['accounts', username]);
    const witnessVotes = currentAccount && currentAccount.get('witness_votes').toSet();
    const currentProxy = currentAccount && currentAccount.get('proxy');
    return {
      witnesses: state.global.get('witnesses'),
      username,
      witnessVotes,
      currentProxy,
      totalVestingShares: state.global.getIn(['props', 'total_vesting_shares']),
    };
  },
  {
    loginIfNeed,
    accountWitnessVote: (username, witness, approve) =>
      transaction.actions.broadcastOperation({
        type: 'account_witness_vote',
        operation: {
          account: username,
          witness,
          approve,
        },
      }),
  }
)(Witnesses);
