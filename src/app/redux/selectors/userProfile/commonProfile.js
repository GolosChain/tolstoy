import { createSelector } from 'reselect';

import normalizeProfile from 'app/utils/NormalizeProfile';
import { repLog10 } from 'app/utils/ParsersAndFormatters';

export const userHeaderSelector = createSelector(
    [(state, { currentAccount }) => currentAccount, state => state.ui.profile],
    (account, profileInfo) => {
        const accountName = account.get('name');
        let witnessInfo = null;
        profileInfo.get('accountsWitnessesInfo').forEach(account => {
            const info = account.get(accountName);
            if (info) {
                witnessInfo = info;
            }
        });
        const jsonData = normalizeProfile({
            json_metadata: account.get('json_metadata'),
            name: accountName,
        });

        return {
            witnessInfo,
            realName: jsonData.name || accountName,
            profileImg: jsonData.profile_image,
            coverImg: jsonData.cover_image,
            reputation: repLog10(account.get('reputation')),
            power: parseFloat(account.get('vesting_shares')).toFixed(3),
        };
    }
);
