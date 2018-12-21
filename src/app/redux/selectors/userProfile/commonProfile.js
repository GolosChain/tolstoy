import { createSelector } from 'reselect';
import { Map, Set } from 'immutable';

import normalizeProfile from 'app/utils/NormalizeProfile';
import { repLog10 } from 'app/utils/ParsersAndFormatters';

import { currentUsernameSelector, globalSelector } from 'src/app/redux/selectors/common';

const emptyMap = Map();
const emptySet = Set();

const checkFollowWitnessButtons = createSelector(
    [
        globalSelector('follow'),
        globalSelector('accounts'),
        currentUsernameSelector,
        (state, { currentAccount }) => currentAccount.get('name'),
    ],
    (followInfo, accounts, authUser, accountUsername) => {
        const follow = followInfo.getIn(['getFollowingAsync', authUser], emptyMap);
        const loading = follow.get('blog_loading', false) || follow.get('ignore_loading', false);
        let followState;
        if (follow.get('blog_result', emptySet).contains(accountUsername)) {
            followState = 'blog';
        } else if (follow.get('ignore_result', emptySet).contains(accountUsername)) {
            followState = 'ignore';
        } else {
            followState = null;
        }

        const witnessUpvoted = accounts
            .getIn([authUser, 'witness_votes'], emptyMap)
            .some(witnesses => witnesses === accountUsername);

        return {
            loading,
            followState,
            witnessUpvoted,
        };
    }
);

export const userHeaderSelector = createSelector(
    [
        (state, { currentAccount }) => currentAccount,
        state => state.ui.profile,
        checkFollowWitnessButtons,
    ],
    (account, profileInfo, profileButtonsInfo) => {
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
            profileButtonsInfo,
            realName: jsonData.name || accountName,
            profileImg: jsonData.profile_image,
            coverImg: jsonData.cover_image,
            reputation: repLog10(account.get('reputation')),
            power: parseFloat(account.get('vesting_shares')).toFixed(3),
        };
    }
);
