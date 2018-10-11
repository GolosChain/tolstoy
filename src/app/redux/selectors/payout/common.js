import { createSelector } from 'reselect';

const FIELDS = {
    AUTHOR_GOLOS: 'author_golos_payout_value',
    AUTHOR_GBG: 'author_gbg_payout_value',
    AUTHOR_GESTS: 'author_gests_payout_value',
    BENEF_GESTS: 'beneficiary_gests_payout_value',
    BENEF_GBG: 'beneficiary_payout_value',
    CURAT_GESTS: 'curator_gests_payout_value',
    CURAT_GBG: 'curator_payout_value',
    TOTAL_GBG: 'total_payout_value',
};

const FIELDS_PENDING = {
    AUTHOR_GOLOS: 'pending_author_payout_golos_value',
    AUTHOR_GBG: 'pending_author_payout_gbg_value',
    AUTHOR_GESTS: 'pending_author_payout_gests_value',
    BENEF_GESTS: 'pending_benefactor_payout_gests_value',
    BENEF_GBG: 'pending_benefactor_payout_value',
    CURAT_GESTS: 'pending_curator_payout_gests_value',
    CURAT_GBG: 'pending_curator_payout_value',
    TOTAL_GBG: 'total_pending_payout_value',
};

const MEMO_LIMIT = 50;

function f(amount) {
    return (amount && parseFloat(amount)) || 0;
}

function memorize(func) {
    const cache = new Map();
    let prevRates = null;
    let order = [];

    return (rates, data) => {
        if (prevRates !== rates) {
            cache.clear();
            order = [];
            prevRates = rates;
        }

        if (cache.has(data)) {
            return cache.get(data);
        }

        const result = func(rates, data);

        cache.set(data, result);
        order.push(data);

        if (order.length === MEMO_LIMIT) {
            const deleteBefore = Math.floor(MEMO_LIMIT / 2);

            for (let i = 0; i < deleteBefore; i++) {
                cache.delete(order[i]);
                order.splice(0, deleteBefore);
            }
        }

        return result;
    };
}

export const getPayout = createSelector(
    [state => state.data.rates, (state, props) => props.data],
    memorize((rates, data) => {
        const max = f(data.get('max_accepted_payout'));
        const isDeclined = max === 0;

        const lastPayout = data.get('last_payout');
        const isPending = !lastPayout || lastPayout.startsWith('19');

        const fields = isPending ? FIELDS_PENDING : FIELDS;

        const totalGbg = f(data.get(fields.TOTAL_GBG));
        const isLimit = max != null && totalGbg > max;

        if (totalGbg === 0 || isDeclined) {
            return {
                isPending,
                total: 0,
                totalGbg: 0,
                overallTotal: 0,
                author: 0,
                authorGbg: 0,
                curator: 0,
                benefactor: 0,
                isLimit,
                isDeclined,
            };
        }

        const benefGests = f(data.get(fields.BENEF_GESTS));
        const benefGbg = f(data.get(fields.BENEF_GBG));

        const curatGests = f(data.get(fields.CURAT_GESTS));

        const authorGbg = f(data.get(fields.AUTHOR_GBG));
        const authorGolos = f(data.get(fields.AUTHOR_GOLOS));
        const authorGests = f(data.get(fields.AUTHOR_GESTS));

        let needLoadRatesForDate = null;

        const authorTotalGbg = totalGbg - benefGbg;

        const percent = data.get('percent_steem_dollars') / 20000;

        let golosPerGbg = authorGolos / (authorTotalGbg * percent - authorGbg);

        if (!golosPerGbg) {
            if (!isPending) {
                const dateRates = rates.dates.get(lastPayout);

                if (dateRates) {
                    golosPerGbg = dateRates.GBG.GOLOS;
                } else {
                    needLoadRatesForDate = lastPayout;
                }
            }

            if (!golosPerGbg) {
                golosPerGbg = rates.actual.GBG.GOLOS;
            }
        }

        const gestsPerGolos = authorGests / (authorTotalGbg * golosPerGbg * (1 - percent));

        const author = authorGolos + authorGests / gestsPerGolos;
        const curator = curatGests / gestsPerGolos;
        const benefactor = benefGests / gestsPerGolos;

        const finalTotal = author + curator + benefactor;
        const finalTotalGbg = authorGbg;

        const overallTotal = finalTotal + finalTotalGbg * golosPerGbg;

        return {
            isPending,
            total: finalTotal,
            totalGbg: finalTotalGbg,
            overallTotal,
            limitedOverallTotal: isLimit ? max * golosPerGbg : overallTotal,
            author,
            authorGbg,
            curator,
            benefactor,
            needLoadRatesForDate,
            isDeclined,
            isLimit,
        };
    })
);
