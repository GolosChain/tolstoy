import { createSelector } from 'reselect';

import normalizeProfile from 'app/utils/NormalizeProfile';

export const userHeaderSelector = createSelector(
    [(state, { currentAccount }) => currentAccount],
    account => {
        const accountName = account.get('name');
        const jsonData = normalizeProfile({
            json_metadata: account.get('json_metadata'),
            name: accountName,
        });

        return {
            realName: jsonData.name || accountName,
            profileImg: jsonData.profile_image,
            coverImg: jsonData.cover_image,
            power: parseFloat(account.get('vesting_shares')).toFixed(3),
        };
    }
);
