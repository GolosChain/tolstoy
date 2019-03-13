import { connect } from 'react-redux';

// import { userHeaderSelector } from 'src/app/redux/selectors/userProfile/commonProfile';
// import { checkWitness } from 'src/app/redux/actions/user';
// import { updateFollow } from 'src/app/redux/actions/follow';
// import { confirmUnfollowDialog } from 'src/app/redux/actions/dialogs';
// import transaction from 'app/redux/Transaction';

import UserHeader from './UserHeader';

export default connect(
    //userHeaderSelector,
    () => ({}),
    {
        checkWitness: () => {},
        updateFollow: () => {},
        confirmUnfollowDialog: () => {},
        accountWitnessVote: () => {},
        // accountWitnessVote: (
        //     username,
        //     witness,
        //     approve,
        //     witnessVoteCallback,
        //     witnessErrorCallback
        // ) =>
        //     transaction.actions.broadcastOperation({
        //         type: 'account_witness_vote',
        //         operation: {
        //             account: username,
        //             witness,
        //             approve,
        //         },
        //         successCallback() {
        //             witnessVoteCallback();
        //         },
        //         errorCallback() {
        //             witnessErrorCallback();
        //         },
        //     }),
    }
)(UserHeader);
