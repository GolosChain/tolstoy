import { connect } from 'react-redux';
import { pathnameSelector } from 'src/app/redux/selectors/app/location';

import Navigation from './Navigation';

export default connect(state => ({
    pathname: pathnameSelector(state),
}))(Navigation);
