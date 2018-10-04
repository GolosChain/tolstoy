import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getVestsToGolosRatio, globalSelector, dataSelector } from 'src/app/redux/selectors/common';
import AccountTokens from './AccountTokens';

const selector = createSelector(
    [
        (state, props) => globalSelector(['accounts', props.accountName])(state),
        getVestsToGolosRatio,
        dataSelector(['rates', 'actual', 'GBG', 'GOLOS']),
    ],
    (account, vestsToGolosRatio, gbgPerGolos) => ({
        golos: account.get('balance').split(' ')[0],
        golosSafe: account.get('savings_balance').split(' ')[0],
        gold: account.get('sbd_balance').split(' ')[0],
        goldSafe: account.get('savings_sbd_balance').split(' ')[0],
        power: (parseFloat(account.get('vesting_shares')) * vestsToGolosRatio).toFixed(3),
        powerDelegated: (
            parseFloat(account.get('received_vesting_shares')) * vestsToGolosRatio
        ).toFixed(3),
        gbgPerGolos,
    })
);

export default connect(selector)(AccountTokens);
