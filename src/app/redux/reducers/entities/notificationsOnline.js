import { Map } from 'immutable';

import { NOTIFICATION_MARK_ALL_AS_VIEWED_SUCCESS } from 'src/app/redux/constants/notifications';
import { NOTIFICATIONS_ONLINE_CLEAR } from 'src/app/redux/constants/notificationsOnline';

const initialState = Map();

// Gets entities from redux-entities-immutable
export default function(state = initialState, { type, payload }) {
    switch (type) {
        case NOTIFICATIONS_ONLINE_CLEAR:
        case NOTIFICATION_MARK_ALL_AS_VIEWED_SUCCESS:
            return initialState;

        default:
            return state;
    }
}
