import { fromJS } from 'immutable';
import {
    NOTIFICATION_GET_HISTORY,
    NOTIFICATION_GET_HISTORY_SUCCESS,
    NOTIFICATION_GET_HISTORY_ERROR,
    NOTIFICATION_GET_HISTORY_FRESH_SUCCESS,
} from 'src/app/redux/constants/notifications';

const initialState = fromJS({
    freshCount: 0, // count of new notifications
    isFetching: false,
    error: null,
});

export default function(state = initialState, { type, payload, error }) {
    switch (type) {
        case NOTIFICATION_GET_HISTORY:
            return state.set('isFetching', true).set('error', null);

        case NOTIFICATION_GET_HISTORY_SUCCESS:
            return state
                .set('freshCount', payload.fresh)
                .set('isFetching', false)
                .set('error', null);

        case NOTIFICATION_GET_HISTORY_ERROR:
            return state.set('isFetching', false).set('error', error);

        case NOTIFICATION_GET_HISTORY_FRESH_SUCCESS:
            return state
                .set('freshCount', payload.fresh)
                .set('isFetching', false)
                .set('error', null);

        default:
            return state;
    }
}
