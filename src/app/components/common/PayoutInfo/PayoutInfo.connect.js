import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getHistoricalData } from 'src/app/redux/actions/rates';

import PayoutInfo from './PayoutInfo';

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

function f(amount) {
    return (amount && parseFloat(amount)) || 0;
}

const stateToProps = createSelector([(state, props) => props.data], data => {
    const isPending = parseFloat(data.get('total_payout_value')) === 0;

    console.log(data.toJS());

    const fields = isPending ? FIELDS_PENDING : FIELDS;

    const benefGests = f(data.get(fields.BENEF_GESTS));
    const benefGbg = f(data.get(fields.BENEF_GBG));

    const curatGests = f(data.get(fields.CURAT_GESTS));
    const curatGbg = f(data.get(fields.CURAT_GBG));

    const gestsPerGbg = benefGests ? benefGests / benefGbg : curatGests / curatGbg;

    const totalGbg = f(data.get(fields.TOTAL_GBG));

    const authorGbg = f(data.get(fields.AUTHOR_GBG));
    const authorGolos = f(data.get(fields.AUTHOR_GOLOS));
    const authorGests = f(data.get(fields.AUTHOR_GESTS));

    const gestsPerGolos =
        ((totalGbg - benefGbg - authorGbg) * gestsPerGbg - authorGests) / authorGolos;
    const gbgPerGolos = gestsPerGolos / gestsPerGbg;

    const author = authorGolos + authorGests / gestsPerGolos;
    const curator = curatGests / gestsPerGolos;
    const benefactor = benefGests / gestsPerGolos;

    const finalTotal = author + curator + benefactor;
    const finalTotalGbg = authorGbg;

    return {
        isPending,
        total: finalTotal,
        totalGbg: finalTotalGbg,
        overallTotal: finalTotal + finalTotalGbg * gbgPerGolos,
        author,
        authorGbg,
        curator,
        benefactor,
    };
});

export default connect(
    stateToProps,
    {
        getHistoricalData,
    }
)(PayoutInfo);
