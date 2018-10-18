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

function memoize(func) {
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

const zeroedPayout = {
    isPending: false,
    total: 0,
    totalGbg: 0,
    overallTotal: 0,
    limitedOverallTotal: 0,
    author: 0,
    authorGbg: 0,
    curator: 0,
    benefactor: 0,
    isLimit: false,
    isDeclined: false,
};

function calculateGolosPerGbg(result, date, rates) {
    if (!result.isPending) {
        const dateRates = rates.dates.get(date);

        if (dateRates) {
            return dateRates.GBG.GOLOS;
        } else {
            result.needLoadRatesForDate = date;
        }
    }

    return rates.actual.GBG.GOLOS;
}

function extractFields(data, fieldsList) {
    const extract = field => parseFloat(data.get(field, 0));

    return {
        benefGests: extract(fieldsList.BENEF_GESTS),
        benefGbg: extract(fieldsList.BENEF_GBG),
        curatGests: extract(fieldsList.CURAT_GESTS),
        authorGbg: extract(fieldsList.AUTHOR_GBG),
        authorGolos: extract(fieldsList.AUTHOR_GOLOS),
        authorGests: extract(fieldsList.AUTHOR_GESTS),
    };
}

export const getPayoutPermLink = createSelector(
    [state => state.data.rates, (state, props) => {
        return state.global.getIn(['content', props.postLink])
    }],
    memoize((rates, data) => {
        const result = { ...zeroedPayout };
        const lastPayout = data.get('last_payout');
        const max = parseFloat(data.get('max_accepted_payout', 0));

        // Date may be "1970-01-01..." or "1969-12-31..." in case of pending payout
        result.isPending = !lastPayout || lastPayout.startsWith('19');
        result.isDeclined = max === 0;

        const fieldsList = result.isPending ? FIELDS_PENDING : FIELDS;
        const totalGbg = parseFloat(data.get(fieldsList.TOTAL_GBG, 0));

        result.isLimit = max != null && totalGbg > max;

        if (totalGbg === 0 || result.isDeclined) {
            return result;
        }

        const fields = extractFields(data, fieldsList);

        const authorTotalGbg = totalGbg - fields.benefGbg;

        // percent_steem_dollars stores in format like 10000, it's mean 100.00%.
        // We divide on 10000 for converting to multiplier. (100.00% = 1)
        const payoutPercent = data.get('percent_steem_dollars') / 10000;
        const golosPowerFraction = payoutPercent / 2;

        let golosPerGbg =
            fields.authorGolos / (authorTotalGbg * golosPowerFraction - fields.authorGbg);

        if (!golosPerGbg) {
            golosPerGbg = calculateGolosPerGbg(result, lastPayout, rates);
        }

        const gestsPerGolos =
            fields.authorGests / (authorTotalGbg * golosPerGbg * (1 - golosPowerFraction));

        result.author = fields.authorGolos + fields.authorGests / gestsPerGolos;
        result.authorGbg = fields.authorGbg;
        result.curator = fields.curatGests / gestsPerGolos;
        result.benefactor = fields.benefGests / gestsPerGolos;
        result.total = result.author + result.curator + result.benefactor;
        result.totalGbg = fields.authorGbg;
        result.overallTotal = result.total + result.totalGbg * golosPerGbg;
        result.limitedOverallTotal = result.isLimit ? max * golosPerGbg : result.overallTotal;
        result.lastPayout = lastPayout;
        return result;
    })
);
