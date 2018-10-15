import { connect } from 'react-redux';

import { getHistoricalData } from 'src/app/redux/actions/rates';
import { getPayout } from 'src/app/redux/selectors/payout/common';
import PayoutInfo from './PayoutInfo';

export default connect(
    getPayout,
    {
        getHistoricalData,
    }
)(PayoutInfo);
