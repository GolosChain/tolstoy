import { connect } from 'react-redux';

import {
    openConvertDialog,
    openDelegateVestingDialog,
    openTransferDialog,
    openSafeDialog,
} from 'src/app/redux/actions/dialogs';

import RightActions from './RightActions';

export default connect(
    (state, props) => {
        const isOwner =
            state.user.getIn(['current', 'username']) === props.pageAccountName.toLowerCase();

        return {
            isOwner,
        };
    },
    {
        openConvertDialog,
        openDelegateVestingDialog,
        openTransferDialog,
        openSafeDialog,
    }
)(RightActions);
