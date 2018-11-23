import { Long } from 'bytebuffer';
import { parsePayoutAmount } from 'app/utils/ParsersAndFormatters';

export function commentsArrayToObject(arr) {
    return arr.reduce((obj, item) => {
        obj[`${item.author}/${item.permlink}`] = item;
        return obj;
    }, {});
}

export function getSortFunction(sortOrder, commentsFullData) {
    return (a, b) => {
        const commentA = commentsFullData[a.url];
        const commentB = commentsFullData[b.url];

        if (sortOrder && sortOrder !== 'votes') {
            if (netNegative(commentA)) {
                return 1;
            } else if (netNegative(commentB)) {
                return -1;
            }
        }

        switch (sortOrder) {
            case 'votes':
                return getActiveVoters(commentB) - getActiveVoters(commentA);
            case 'new':
                return Date.parse(commentB['created']) - Date.parse(commentA['created']);
            case 'trending':
                const payoutA = totalPayout(commentA);
                const payoutB = totalPayout(commentB);

                if (payoutA !== payoutB) {
                    return payoutB - payoutA;
                }

                // If SBD payouts were equal, fall back to rshares sorting
                return netRshares(payoutB).compare(netRshares(payoutA));
            case 'old':
                return Date.parse(commentA['created']) - Date.parse(commentB['created']);
        }
    };
}

function netRshares(comment) {
    return Long.fromString(String(comment['net_rshares']));
}

function totalPayout(comment) {
    return (
        parsePayoutAmount(comment['pending_payout_value']) +
        parsePayoutAmount(comment['total_payout_value']) +
        parsePayoutAmount(comment['curator_payout_value'])
    );
}

function netNegative(comment) {
    return comment['net_rshares'] < 0;
}

function getActiveVoters(comment) {
    return comment['active_votes'].filter(vote => vote.percent > 0).length;
}
