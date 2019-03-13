import { connect } from 'react-redux';

// import { currentUsernameSelector } from 'app/redux/selectors/common';
// import { fetchUserLastOnline } from 'app/redux/actions/userOnline';

import OnlineStatus from './OnlineStatus';

export default connect(
  (state, props) => ({
    // isOwner: currentUsernameSelector(state) === props.username,
    isOwner: true,
  }),
  {
    fetchUserLastOnline: () => {},
  }
)(OnlineStatus);
