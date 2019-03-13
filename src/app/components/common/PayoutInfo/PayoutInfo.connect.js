import { connect } from 'react-redux';

// import { getPayoutPermLink } from 'src/app/redux/selectors/payout/common';
// import { getHistoricalData } from 'src/app/redux/actions/rates';
import PayoutInfo from './PayoutInfo';

export default connect(
    // getPayoutPermLink,
    () => ({}),
    {
        getHistoricalData: () => {},
    }
)(PayoutInfo);
