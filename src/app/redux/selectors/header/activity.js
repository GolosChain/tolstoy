import {
    createDeepEqualSelector,
    entitiesArraySelector,
    statusSelector,
} from './../common';
import { hydratedNotificationsSelector } from './../notifications';

// Header activity selectors

const filteredNotificationsSelector = createDeepEqualSelector(
    [entitiesArraySelector('notificationsOnline')],
    notifications => notifications.sortBy(a => a.get('createdAt')).reverse().take(5)
);

export const notificationsMenuSelector = createDeepEqualSelector(
    [
        hydratedNotificationsSelector(filteredNotificationsSelector),
        statusSelector('notificationsOnline'),
    ],
    (notifications, notificationsStatus) => ({
        notifications,
        isFetching: notificationsStatus.get('isFetching'),
    })
);
