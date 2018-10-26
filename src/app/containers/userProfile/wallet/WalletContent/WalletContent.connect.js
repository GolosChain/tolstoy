import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import transaction from 'app/redux/Transaction';
import WalletContent from './WalletContent';
import {
    getGlobalPropsSelector,
    currentUsernameSelector,
    accountSelector,
} from 'src/app/redux/selectors/common';

export default connect(
    createSelector(
        [
            getGlobalPropsSelector,
            (state, props) => {
                const myAccountName = currentUsernameSelector(state);
                const pageAccountName = props.params.accountName.toLowerCase();

                return {
                    pageAccountName,
                    pageAccount: accountSelector(state, pageAccountName),
                    myAccountName,
                    myAccount: accountSelector(state, myAccountName),
                    isOwner: pageAccountName === myAccountName,
                };
            },
        ],
        (globalProps, data) => ({
            ...data,
            globalProps,
        })
    ),
    {
        delegate: (operation, callback) =>
            transaction.actions.broadcastOperation({
                type: 'delegate_vesting_shares',
                operation,
                successCallback() {
                    callback(null);
                },
                errorCallback(err) {
                    callback(err);
                },
            }),
        loadRewards: (account, type) => ({
            type: 'FETCH_REWARDS',
            payload: {
                account,
                type,
            },
        }),
    }
)(WalletContent);
