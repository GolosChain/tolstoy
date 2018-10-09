import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getHistoricalData } from 'src/app/redux/actions/rates';

import PayoutInfo from './PayoutInfo';

function f(amount) {
    return (amount && parseFloat(amount)) || 0;
}

const stateToProps = createSelector([(state, props) => props.data], (data, vestsToGolosRatio) => {
    const isPending = parseFloat(data.get('total_payout_value')) === 0;

    let total;
    let author;
    let curator;
    let benefactor;

    if (isPending) {
        total = f(data.get('total_pending_payout_value'));
        author = total - f(data.get('pending_benefactor_payout_value'));
        curator = f(data.get('pending_curator_payout_value'));
        benefactor = f(data.get('pending_benefactor_payout_value'));
    } else {
        total = f(data.get('total_payout_value'));
        author = total - f(data.get('beneficiary_payout_value'));
        curator = f(data.get('curator_payout_value'));
        benefactor = f(data.get('beneficiary_payout_value'));
    }

    return {
        isPending,
        total: total + curator,
        author: author,
        curator: curator,
        benefactor: benefactor,
    };
});

export default connect(
    stateToProps,
    {
        getHistoricalData,
    }
)(PayoutInfo);
