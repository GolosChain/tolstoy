import { connect } from 'react-redux';
import { pathnameSelector } from 'src/app/redux/selectors/ui/location';

import Navigation from './Navigation';

export default connect(state => ({
    pathname: pathnameSelector(state),
}))(Navigation);
