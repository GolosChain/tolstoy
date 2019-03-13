import { connect } from 'react-redux';

import transaction from 'app/redux/Transaction';
import { fetchCurrentStateAction } from 'src/app/redux/actions/fetch';
import { showNotification } from 'src/app/redux/actions/ui';

import TransferDialog from './TransferDialog';

export default connect(
  state => {
    const currentUser = state.user.getIn(['current']);
    const currentAccount = currentUser
      ? state.global.getIn(['accounts', currentUser.get('username')])
      : null;

    return {
      currentUser,
      currentAccount,
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
