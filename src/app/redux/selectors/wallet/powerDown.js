import { createSelector } from 'reselect';

import { vestsToGolosPower } from 'app/utils/StateFunctions';
import { currentAccountSelector } from 'src/app/redux/selectors/common';

export const powerDownSelector = createSelector(
    [currentAccountSelector, state => state.global.get('props')],
    (account, globalProps) => {
        if (!account) {
            return null;
        }

        const toWithdraw = account.get('to_withdraw') / 1000000;
        const withdrawn = account.get('withdrawn') / 1000000;

        // Случай когда перевод не начинался или полностью завершен.
        if (toWithdraw === 0 || toWithdraw <= withdrawn) {
            return null;
        }

        const toWithdrawGolos = vestsToGolosPower(globalProps, toWithdraw);
        const withdrawnGolos = vestsToGolosPower(globalProps, withdrawn);

        return {
            nextWithdrawal: account.get('next_vesting_withdrawal'),
            toWithdraw: toWithdrawGolos,
            withdrawn: withdrawnGolos,
        };
    }
);
