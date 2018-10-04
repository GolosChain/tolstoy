import { fromJS } from 'immutable';
import { NOTIFICATION_ONLINE_ADD_NOTIFICATION } from 'src/app/redux/constants/notificationsOnline';
import { values, flatten } from 'ramda';

import {
    NOTIFICATION_GET_HISTORY_FRESH,
    NOTIFICATION_GET_HISTORY_FRESH_SUCCESS,
    NOTIFICATION_GET_HISTORY_FRESH_ERROR,
} from 'src/app/redux/constants/notifications';

const initialState = fromJS({
    freshCount: 0, // count on new notifications
    // isFetching: false,
    // error: null,
});

export default function(state = initialState, { type, payload, error }) {
    switch (type) {
        case NOTIFICATION_ONLINE_ADD_NOTIFICATION:
            const count = flatten(values(payload)).length;
            return state.set('freshCount', state.get('freshCount') + count);

        default:
            return state;
    }
}
