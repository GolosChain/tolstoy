import { createSelector } from 'reselect';
import { vestsToGolos } from 'app/utils/StateFunctions';

export const getAccountPrice = createSelector(
    (state, accountName) => state.global.getIn(['accounts', accountName]),
    state => state.global.get('props'),
    state => state.data.rates.actual,
    state => state.data.settings.getIn(['basic', 'currency'], 'GBG'),

    (account, globalProps, rates, currency) => {
        if (currency !== 'GBG' && !rates.GOLOS[currency]) {
            currency = 'GBG';
        }

        const golos = account.get('balance').split(' ')[0];
        const golosSafe = account.get('savings_balance').split(' ')[0];
        const gold = account.get('sbd_balance').split(' ')[0];
        const goldSafe = account.get('savings_sbd_balance').split(' ')[0];
        const power = account.get('vesting_shares');

        const golosRate = getRate(rates, 'GOLOS', currency);
        const gbgRate = getRate(rates, 'GBG', currency);

        let sum = 0;

        sum += parseFloat(golos) * golosRate || 0;
        sum += parseFloat(golosSafe) * golosRate || 0;
        sum += parseFloat(gold) * gbgRate || 0;
        sum += parseFloat(goldSafe) * gbgRate || 0;
        sum += parseFloat(vestsToGolos(power, globalProps.toJS())) * golosRate || 0;

        return {
            price: sum,
            currency,
        };
    }
);

function getRate(rates, from, to) {
    if (from === to) {
        return 1;
    } else {
        return rates[from][to];
    }
}
