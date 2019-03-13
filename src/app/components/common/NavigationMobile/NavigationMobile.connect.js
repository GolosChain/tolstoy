import { connect } from 'react-redux';

// import { pathnameSelector } from 'src/app/redux/selectors/app/location';

import NavigationMobile from './NavigationMobile';

export default connect(state => ({
  //pathname: pathnameSelector(state),
  pathname: '',
}))(NavigationMobile);
