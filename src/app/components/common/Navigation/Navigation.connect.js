import { connect } from 'react-redux';
import { locationSelector } from 'src/app/redux/selectors/common';

import Navigation from './Navigation';

export default connect(state => ({
    location: locationSelector(state),
}))(Navigation);
