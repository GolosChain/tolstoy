import { connect } from 'react-redux';

//import { currentUserSelector } from 'src/app/redux/selectors/common';

import RegistrationBanner from './RegistrationBanner';

export default connect(() => ({
  currentUserSelector: 'currentUserSelector',
}))(RegistrationBanner);
