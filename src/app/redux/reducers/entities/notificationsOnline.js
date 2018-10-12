import { Map } from 'immutable';

import { NOTIFICATION_ONLINE_GET_HISTORY } from 'src/app/redux/constants/notificationsOnline';

const initialState = Map();

// Gets entities from redux-entities-immutable
export default function(state = initialState, { type, payload }) {
    switch (type) {
        case NOTIFICATION_ONLINE_GET_HISTORY:
            return initialState;

        default:
            return state;
    }
}
