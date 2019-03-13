import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { currentUsernameSelector } from 'app/redux/selectors/common';
// import { updateFollow } from 'app/redux/actions/follow';
//import { muteSelector } from 'app/redux/selectors/follow/follow';

import { Mute } from './Mute';

export default connect(
  // createSelector(
  //     [muteSelector, currentUsernameSelector],
  //     (muteData, username) => ({
  //         ...muteData,
  //         username,
  //     })
  // ),
  () => ({}),
  {
    updateFollow: () => {},
  }
)(Mute);
