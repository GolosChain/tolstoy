import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';

// import { currentUsernameSelector } from 'src/app/redux/selectors/common';
// import { locationSearchSelector } from 'src/app/redux/selectors/app/location';

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
