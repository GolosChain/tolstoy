import { connect } from 'react-redux';

import user from 'app/redux/User';
import ShowKey from './ShowKey';

export default connect(
    null,
    {
        showLogin: ({ username, authType, onClose }) =>
            user.actions.showLogin({
                username,
                authType,
                forceSave: true,
                onClose,
            }),
    }
)(ShowKey);
