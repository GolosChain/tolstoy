import { connect } from 'react-redux';

import { createDeepEqualSelector, dataSelector } from 'src/app/redux/selectors/common';

import HomeContainer from './HomeContainer';

export default connect()(HomeContainer);
