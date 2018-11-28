import { Map } from 'immutable';

import { NOTIFICATION_ONLINE_GET_HISTORY } from 'src/app/redux/constants/notificationsOnline';
import { NOTIFICATION_MARK_ALL_AS_VIEWED_SUCCESS } from 'src/app/redux/constants/notifications';

const initialState = Map();

// Gets entities from redux-entities-immutable
export default function(state = initialState, { type, payload }) {
    switch (type) {
        case NOTIFICATION_ONLINE_GET_HISTORY:
        case NOTIFICATION_MARK_ALL_AS_VIEWED_SUCCESS:
            return initialState;

        default:
            return state;
    }
}
