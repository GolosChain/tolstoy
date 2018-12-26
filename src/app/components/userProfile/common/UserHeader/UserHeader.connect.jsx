import { connect } from 'react-redux';

import UserHeader from './UserHeader';
import { userHeaderSelector } from 'src/app/redux/selectors/userProfile/commonProfile';
import { checkWitness } from 'src/app/redux/actions/user';
import { updateFollow } from 'src/app/redux/actions/follow';
import { confirmUnfollowDialog } from 'src/app/redux/actions/dialogs';
import { loginIfNeed } from 'src/app/redux/actions/login';
import transaction from 'app/redux/Transaction';

export default connect(
    userHeaderSelector,
    {
        checkWitness,
        updateFollow,
        confirmUnfollowDialog,
        loginIfNeed,
        accountWitnessVote: (username, witness, approve, witnessVoteCallback) =>
            transaction.actions.broadcastOperation({
                type: 'account_witness_vote',
                operation: {
                    account: username,
                    witness,
                    approve,
                },
                successCallback() {
                    witnessVoteCallback();
                },
            }),
    }
)(UserHeader);
