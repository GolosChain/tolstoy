import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserSelector } from 'src/app/redux/selectors/common';
import RegistrationBanner from './RegistrationBanner';

export default connect(createSelector([currentUserSelector], currentUser => ({ currentUser })))(
    RegistrationBanner
);
