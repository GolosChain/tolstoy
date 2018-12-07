import { GATE_SEND_MESSAGE } from 'src/app/redux/constants/gate';
import {
    NOTIFICATION_GET_HISTORY,
    NOTIFICATION_GET_HISTORY_SUCCESS,
    NOTIFICATION_GET_HISTORY_ERROR,
    NOTIFICATION_MARK_ALL_AS_VIEWED,
    NOTIFICATION_MARK_ALL_AS_VIEWED_SUCCESS,
    NOTIFICATION_MARK_ALL_AS_VIEWED_ERROR,
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

export function markAllNotificationsAsViewed({ user = null } = {}) {
    return {
        type: GATE_SEND_MESSAGE,
        payload: {
            method: 'notify.markAllAsViewed',
            types: [
                NOTIFICATION_MARK_ALL_AS_VIEWED,
                NOTIFICATION_MARK_ALL_AS_VIEWED_SUCCESS,
                NOTIFICATION_MARK_ALL_AS_VIEWED_ERROR,
            ],
            data: { user },
        },
        meta: { user },
    };
}
