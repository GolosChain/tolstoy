import { fromJS } from 'immutable';
import { NOTIFICATION_ONLINE_ADD_NOTIFICATION } from 'src/app/redux/constants/notificationsOnline';
import { values, flatten } from 'ramda';

import {
    NOTIFICATION_ONLINE_GET_HISTORY,
    NOTIFICATION_ONLINE_GET_HISTORY_SUCCESS,
    NOTIFICATION_ONLINE_GET_HISTORY_ERROR,
    NOTIFICATION_ONLINE_GET_HISTORY_FRESH_SUCCESS,
    NOTIFICATION_ONLINE_MARK_ALL_AS_VIEWED_SUCCESS,
} from 'src/app/redux/constants/notificationsOnline';
import { NOTIFICATION_GET_HISTORY_SUCCESS } from 'src/app/redux/constants/notifications';

const initialState = fromJS({
    freshCount: 0, // count on new notifications
    isFetching: false,
    error: null,
});

export default function(state = initialState, { type, payload, error }) {
    switch (type) {
        case NOTIFICATION_ONLINE_ADD_NOTIFICATION:
            const count = flatten(values(payload)).length;
            return state.set('freshCount', state.get('freshCount') + count);

        case NOTIFICATION_ONLINE_GET_HISTORY:
            return state.set('isFetching', true).set('error', null);

        case NOTIFICATION_ONLINE_GET_HISTORY_SUCCESS:

        case NOTIFICATION_ONLINE_GET_HISTORY_FRESH_SUCCESS:
            return state
                .set('freshCount', payload.freshByTypes.summary)
                .set('isFetching', false)
                .set('error', null);

        case NOTIFICATION_ONLINE_GET_HISTORY_ERROR:
            return state.set('isFetching', false).set('error', error);

        case NOTIFICATION_GET_HISTORY_SUCCESS:
            return state.set('freshCount', payload.freshByTypes.summary);

        case NOTIFICATION_ONLINE_MARK_ALL_AS_VIEWED_SUCCESS:
            return state
                .set('freshCount', 0)
                .set('isFetching', false)
                .set('error', null);

        default:
            return state;
    }
}
