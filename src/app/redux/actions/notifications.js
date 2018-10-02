import { GATE_SEND_MESSAGE } from 'src/app/redux/constants/gate';
import {
    NOTIFICATION_GET_HISTORY,
    NOTIFICATION_GET_HISTORY_SUCCESS,
    NOTIFICATION_GET_HISTORY_ERROR,

    NOTIFICATION_GET_HISTORY_FRESH,
    NOTIFICATION_GET_HISTORY_FRESH_SUCCESS,
    NOTIFICATION_GET_HISTORY_FRESH_ERROR,
} from 'src/app/redux/constants/notifications';
import Schemas from 'src/app/redux/sagas/gate/api/schemas';
import { hydrateNotifications } from 'src/app/redux/sagas/actions/notifications';

export function getNotificationsHistory({ fromId = null, limit = 10, types = 'all' }) {
    return {
        type: GATE_SEND_MESSAGE,
        payload: {
            method: 'getNotifyHistory',
            types: [
                NOTIFICATION_GET_HISTORY,
                NOTIFICATION_GET_HISTORY_SUCCESS,
                NOTIFICATION_GET_HISTORY_ERROR,
            ],
            data: { fromId, limit, types },
            normalize: {
                transform: payload => payload.data,
                saga: hydrateNotifications,
                schema: Schemas.NOTIFICATION_ARRAY,
            },
        },
        meta: { fromId, limit, types },
    };
}

export function getNotificationsHistoryFreshCount({ user = null } = {}) {
    return {
        type: GATE_SEND_MESSAGE,
        payload: {
            method: 'getNotifyHistoryFresh',
            types: [
                NOTIFICATION_GET_HISTORY_FRESH,
                NOTIFICATION_GET_HISTORY_FRESH_SUCCESS,
                NOTIFICATION_GET_HISTORY_FRESH_ERROR,
            ],
            data: { user },
        },
        meta: { user },
    };
}
