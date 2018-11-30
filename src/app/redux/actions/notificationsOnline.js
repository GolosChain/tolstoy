import React from 'react';

import NotificationOnlineContent from 'src/app/components/common/NotificationOnlineContent';
import Icon from 'golos-ui/Icon';

import { GATE_SEND_MESSAGE } from 'src/app/redux/constants/gate';
import {
    NOTIFICATION_ONLINE_ADD_NOTIFICATION,
    NOTIFICATION_ONLINE_GET_HISTORY,
    NOTIFICATION_ONLINE_GET_HISTORY_SUCCESS,
    NOTIFICATION_ONLINE_GET_HISTORY_ERROR,
    NOTIFICATION_ONLINE_GET_HISTORY_FRESH,
    NOTIFICATION_ONLINE_GET_HISTORY_FRESH_SUCCESS,
    NOTIFICATION_ONLINE_GET_HISTORY_FRESH_ERROR,
} from 'src/app/redux/constants/notificationsOnline';
import Schemas from 'src/app/redux/sagas/gate/api/schemas';
import { hydrateNotifications } from 'src/app/redux/sagas/actions/notifications';

export const createAddNotificationOnlineAction = notification => {
    const baseStyles = {
        display: 'flex',
        alignItems: 'center',
        left: 'auto',
        background: '#ffffff',
        borderRadius: '6px',
        paddingTop: '0',
        paddingBottom: '0',
        paddingLeft: '20px',
        paddingRight: '20px',
        lineHeight: '1',
        minHeight: '60px',
    };

    return {
        type: 'ADD_NOTIFICATION',
        payload: {
            barStyle: {
                ...baseStyles,
                right: '-100%',
            },
            activeBarStyle: {
                ...baseStyles,
                right: '2.5rem',
            },
            actionStyle: {
                display: 'flex',
                alignItems: 'center',
                marginLeft: '18px',
                cursor: 'pointer',
            },
            key: 'chain_' + Date.now(),
            message: <NotificationOnlineContent notification={notification} />,
            action: <Icon name="cross" size="14" style={{ color: '#e1e1e1' }} />,
            dismissAfter: 15000,
        },
    };
};

export const addNotificationOnline = payload => ({
    type: NOTIFICATION_ONLINE_ADD_NOTIFICATION,
    payload,
});

export function getNotificationsOnlineHistory({
    freshOnly = false,
    markAsViewed = true,
    fromId = null,
    limit = 10,
    types = 'all',
}) {
    return {
        type: GATE_SEND_MESSAGE,
        payload: {
            method: 'onlineNotify.history',
            types: [
                NOTIFICATION_ONLINE_GET_HISTORY,
                NOTIFICATION_ONLINE_GET_HISTORY_SUCCESS,
                NOTIFICATION_ONLINE_GET_HISTORY_ERROR,
            ],
            data: { freshOnly, markAsViewed, fromId, limit, types },
            normalize: {
                transform: payload => payload.data,
                saga: hydrateNotifications,
                schema: Schemas.NOTIFICATION_ONLINE_ARRAY,
            },
        },
        meta: { freshOnly, markAsViewed, fromId, limit, types },
    };
}

export function getNotificationsOnlineHistoryFreshCount() {
    return {
        type: GATE_SEND_MESSAGE,
        payload: {
            method: 'onlineNotify.historyFresh',
            types: [
                NOTIFICATION_ONLINE_GET_HISTORY_FRESH,
                NOTIFICATION_ONLINE_GET_HISTORY_FRESH_SUCCESS,
                NOTIFICATION_ONLINE_GET_HISTORY_FRESH_ERROR,
            ],
            data: {},
        },
    };
}
