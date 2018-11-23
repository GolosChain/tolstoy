import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import transaction from 'app/redux/Transaction';
import WalletContent from './WalletContent';
import {
    currentUserSelector,
    pageAccountSelector,
    globalSelector,
} from 'src/app/redux/selectors/common';
import { openTransferDialog } from 'src/app/redux/actions/dialogs';
import { setWalletTabState, setWalletTabsState } from 'src/app/redux/actions/ui';
import { uiSelector } from 'src/app/redux/selectors/common';

export const getGlobalPropsSelector = createSelector([globalSelector('props')], props =>
    props.toJS()
);

export default connect(
    createSelector(
        [getGlobalPropsSelector, currentUserSelector, pageAccountSelector, uiSelector('wallet')],
        (globalProps, myAccount, pageAccount, wallet) => {
            const pageAccountName = pageAccount.get('name');
            const myAccountName = myAccount ? myAccount.get('username') : null;
            const walletTabsState = wallet.get('tabsState');

            return {
                myAccount,
                myAccountName,
                pageAccount,
                pageAccountName,
                walletTabsState,
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
        setWalletTabState: tab => {
            dispatch(setWalletTabState(tab));
        },
        setWalletTabsState: tabs => {
            dispatch(setWalletTabsState(tabs));
        },
        openTransferDialog: ({ to, amount, token, memo }) => {
            dispatch(
                openTransferDialog(to, {
                    type: 'query',
                    amount,
                    token,
                    memo,
                })
            );
        },
    })
)(WalletContent);
