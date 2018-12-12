import { connect } from 'react-redux';
import { PrivateKey } from 'golos-js/lib/auth/ecc';

import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import { settingsContentSelector } from 'src/app/redux/selectors/userProfile/settings';
import { getSettingsOptions, setSettingsOptions } from 'src/app/redux/actions/settings';
import { showNotification } from 'src/app/redux/actions/ui';
import { authProtection } from 'src/app/helpers/hoc';

import SettingsContent from './SettingsContent';

export default authProtection()(
    connect(
        settingsContentSelector,
        dispatch => ({
            updateAccount: ({ successCallback, errorCallback, ...operation }) => {
                dispatch(
                    transaction.actions.broadcastOperation({
                        type: 'account_metadata',
                        operation,
                        successCallback: () => {
                            dispatch(user.actions.getAccount());
                            successCallback();
                        },
                        errorCallback,
                    })
                );
            },
            changePassword: ({ accountName, password, newWif, successCallback, errorCallback }) => {
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
                        onSuccess: successCallback,
                        onError: errorCallback,
                    })
                );
            },
            notify: (message, dismiss = 3000) => {
                dispatch(showNotification(message, 'settings', dismiss));
            },
            getSettingsOptions: () => dispatch(getSettingsOptions()),
            setSettingsOptions: values => dispatch(setSettingsOptions(values)),
        })
    )(SettingsContent)
);
