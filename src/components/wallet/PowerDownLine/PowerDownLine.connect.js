import { connect } from 'react-redux';

import transaction from 'app/redux/Transaction';
import { fetchCurrentStateAction } from 'app/redux/actions/fetch';
import { showNotification } from 'app/redux/actions/ui';
import { powerDownSelector } from 'app/redux/selectors/wallet/powerDown';

import PowerDownLine from './PowerDownLine';

export default connect(
  powerDownSelector,
  {
    showNotification,
    cancelPowerDown: (accountName, callback) => dispatch =>
      dispatch(
        transaction.actions.broadcastOperation({
          type: 'withdraw_vesting',
          operation: {
            account: accountName,
            vesting_shares: '0.000000 GESTS',
          },
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
  }
)(PowerDownLine);
