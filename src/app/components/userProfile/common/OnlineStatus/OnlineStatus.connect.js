import { connect } from 'react-redux';

// import { currentUsernameSelector } from 'src/app/redux/selectors/common';
// import { fetchUserLastOnline } from 'src/app/redux/actions/userOnline';

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
