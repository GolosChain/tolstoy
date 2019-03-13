import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';

// import { currentUsernameSelector } from 'app/redux/selectors/common';
// import { locationSearchSelector } from 'app/redux/selectors/app/location';

import MainNavigation from './MainNavigation';

export default connect(
  // createStructuredSelector({
  //     myAccountName: currentUsernameSelector,
  //     search: locationSearchSelector,
  // })
  () => ({
    myAccountName: 'currentUsernameSelector',
    search: '',
  })
)(MainNavigation);
