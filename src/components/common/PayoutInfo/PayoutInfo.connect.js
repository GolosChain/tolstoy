import { connect } from 'react-redux';

// import { getPayoutPermLink } from 'app/redux/selectors/payout/common';
// import { getHistoricalData } from 'app/redux/actions/rates';
import PayoutInfo from './PayoutInfo';

export default connect(
  // getPayoutPermLink,
  () => ({}),
  {
    getHistoricalData: () => {},
  }
)(PayoutInfo);
