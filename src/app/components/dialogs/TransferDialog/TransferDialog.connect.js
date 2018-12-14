import { connect } from 'react-redux';

import transaction from 'app/redux/Transaction';
import { fetchCurrentStateAction } from 'src/app/redux/actions/fetch';
import { showNotification } from 'src/app/redux/actions/ui';

import TransferDialog from './TransferDialog';

export default connect(
    state => {
        const myUser = state.user.getIn(['current']);
        const myAccount = myUser ? state.global.getIn(['accounts', myUser.get('username')]) : null;

        return {
            myUser,
            myAccount,
        };
    },
    {
        transfer: (operation, callback) => dispatch =>
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'transfer',
                    operation,
                    successCallback() {
                        callback(null);

                        if (location.pathname.endsWith('/transfers')) {
                            dispatch(fetchCurrentStateAction());
                        }
                    },
                    errorCallback(err) {
                        callback(err);
                    },
                })
            ),
        showNotification,
    },
    null,
    { withRef: true }
)(TransferDialog);
