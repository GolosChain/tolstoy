import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import transaction from 'app/redux/Transaction';
import { vestsToGolos } from 'src/app/utils/StateFunctions';
import { fetchCurrentStateAction } from 'src/app/redux/actions/fetch';
import { showNotification } from 'src/app/redux/actions/ui';
import { currentUserSelector, currentAccountSelector } from 'src/app/redux/selectors/common';
import { powerDownSelector } from 'src/app/redux/selectors/wallet/powerDown';

import ConvertDialog from './ConvertDialog';

export default connect(
    createSelector(
        [
            state => state.global.get('props').toJS(),
            currentUserSelector,
            currentAccountSelector,
            powerDownSelector,
        ],
        (globalProps, myUser, myAccount, powerDownInfo) => ({
            globalProps,
            myUser,
            myAccount,
            ...powerDownInfo,
        })
    ),
    {
        transfer: (type, operation, callback) => dispatch =>
            dispatch(
                transaction.actions.broadcastOperation({
                    type,
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
)(ConvertDialog);

function getVesting(account, props) {
    const vesting = parseFloat(account.get('vesting_shares'));
    const delegated = parseFloat(account.get('delegated_vesting_shares'));

    const availableVesting = vesting - delegated;

    return {
        golos: vestsToGolos(availableVesting.toFixed(6) + ' GESTS', props),
    };
}
