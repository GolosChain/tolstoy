import { connect } from 'react-redux';
import { App } from 'src/app/containers/App';
import { createSelector } from 'reselect';

import user from 'app/redux/User';
import {
    newVisitorSelector,
    offchainSelector,
    appSelector as appStateSelector,
} from 'src/app/redux/selectors/common';

export default connect(
    createSelector(
        [appStateSelector('error'), offchainSelector('flash'), newVisitorSelector],
        (error, flash, newVisitor) => ({
            error,
            flash,
            newVisitor,
        })
    ),
    {
        loginUser: () => user.actions.autoLogin({}),
        logoutUser: user.actions.logout,
    }
)(App);
