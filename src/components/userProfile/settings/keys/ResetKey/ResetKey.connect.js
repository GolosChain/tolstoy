import { connect } from 'react-redux';
import transaction from 'app/redux/Transaction';
import { PrivateKey } from 'golos-js/lib/auth/ecc';

import { showNotification } from 'app/redux/actions/ui';
import ResetKey from './ResetKey';

export default connect(
  null,
  {
    changePassword: ({
      accountName,
      password,
      newWif,
      clearAccountAuths,
      successCallback,
      errorCallback,
    }) => {
      const ph = role => PrivateKey.fromSeed(`${accountName}${role}${newWif}`).toWif();
      return transaction.actions.updateAuthorities({
        accountName,
        auths: [
          { authType: 'owner', oldAuth: password, newAuth: ph('owner', newWif) },
          {
            authType: 'active',
            oldAuth: password,
            newAuth: ph('active', newWif),
          },
          {
            authType: 'posting',
            oldAuth: password,
            newAuth: ph('posting', newWif),
          },
          { authType: 'memo', oldAuth: password, newAuth: ph('memo', newWif) },
        ],
        clearAccountAuths,
        onSuccess: successCallback,
        onError: errorCallback,
      });
    },
    notify: (message, dismiss = 3000) => showNotification(message, 'settings', dismiss),
  }
)(ResetKey);
