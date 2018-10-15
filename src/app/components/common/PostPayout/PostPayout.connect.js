import { connect } from 'react-redux';

import { getPayout } from 'src/app/redux/selectors/payout/common';
import PostPayout from './PostPayout';

export default connect(getPayout)(PostPayout);
