import { connect } from 'react-redux';
import g from 'app/redux/GlobalReducer';
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
        showQRKey: ({ type, isPrivate, text }) =>
            g.actions.showDialog({
                name: 'qr_key',
                params: {
                    type,
                    isPrivate,
                    text,
                },
            }),
    }
)(ShowKey);
