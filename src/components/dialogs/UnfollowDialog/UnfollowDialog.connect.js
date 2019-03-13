import { connect } from 'react-redux';

import { UnfollowDialog } from './UnfollowDialog';
import { updateFollow } from 'src/app/redux/actions/follow';

export default connect(
  state => {
    return {
      currentUser: state.user.getIn(['current', 'username']),
    };
  },
  {
    updateFollow,
  }
)(UnfollowDialog);
