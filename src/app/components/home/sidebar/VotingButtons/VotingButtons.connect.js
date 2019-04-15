import { connect } from 'react-redux';

import VotingButtons from './VotingButtons';
import transaction from 'app/redux/Transaction';
import { showNotification } from 'src/app/redux/actions/ui';
import { loginIfNeed } from 'src/app/redux/actions/login';

export default connect(
    state => {
        const currentUser = state.user.getIn(['current']);

        return {
            currentUser,
        };
    },
    {
        transfer: (operation, callback) =>
            transaction.actions.broadcastOperation({
                type: 'transfer',
                operation,
                successCallback() {
                    callback(null);
                },
                errorCallback(err) {
                    callback(err);
                },
            }),
        loginIfNeed,
        showNotification,
    }
)(VotingButtons);
