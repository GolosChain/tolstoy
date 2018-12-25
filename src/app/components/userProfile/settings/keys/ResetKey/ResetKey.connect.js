import { connect } from 'react-redux';
import transaction from 'app/redux/Transaction';
import { PrivateKey } from 'golos-js/lib/auth/ecc';

import { showNotification } from 'src/app/redux/actions/ui';
import ResetKey from './ResetKey';

export default connect(
    null,
    dispatch => ({
        changePassword: ({
            accountName,
            password,
            newWif,
            clearAccountAuths,
            successCallback,
            errorCallback,
        }) => {
            const ph = role => PrivateKey.fromSeed(`${accountName}${role}${newWif}`).toWif();
            dispatch(
                transaction.actions.updateAuthorities({
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
                })
            );
        },
        notify: (message, dismiss = 3000) => {
            dispatch(showNotification(message, 'settings', dismiss));
        },
    })
)(ResetKey);
