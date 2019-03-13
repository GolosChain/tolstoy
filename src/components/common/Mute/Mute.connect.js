import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import { currentUsernameSelector } from 'src/app/redux/selectors/common';
// import { updateFollow } from 'src/app/redux/actions/follow';
//import { muteSelector } from 'src/app/redux/selectors/follow/follow';

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
