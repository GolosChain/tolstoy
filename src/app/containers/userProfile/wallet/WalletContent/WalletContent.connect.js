import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import transaction from 'app/redux/Transaction';
import WalletContent from './WalletContent';
import {
    currentUserSelector,
    pageAccountSelector,
    globalSelector,
} from 'src/app/redux/selectors/common';

export const getGlobalPropsSelector = createSelector([globalSelector('props')], props =>
    props.toJS()
);

export default connect(
    createSelector(
        [getGlobalPropsSelector, currentUserSelector, pageAccountSelector],
        (globalProps, myAccount, pageAccount) => {
            const pageAccountName = pageAccount.get('name');
            const myAccountName = myAccount ? myAccount.get('username') : null;

            return {
                myAccount,
                myAccountName,
                pageAccount,
                pageAccountName,
                isOwner: myAccountName && pageAccountName === myAccountName,
                globalProps,
            };
        }
    ),
    dispatch => ({
        delegate: (operation, callback) =>
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'delegate_vesting_shares',
                    operation,
                    successCallback() {
                        callback(null);
                    },
                    errorCallback(err) {
                        callback(err);
                    },
                })
            ),
        loadRewards: (account, type) =>
            dispatch({
                type: 'FETCH_REWARDS',
                payload: {
                    account,
                    type,
                },
            }),
        getContent: payload =>
            new Promise((resolve, reject) => {
                dispatch({
                    type: 'GET_CONTENT',
                    payload: { ...payload, resolve, reject },
                });
            }),
    })
)(WalletContent);
