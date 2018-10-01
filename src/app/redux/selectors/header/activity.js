import {
    createDeepEqualSelector,
    globalSelector,
    entitiesArraySelector,
    statusSelector,
} from './../common';
import { hydratedNotificationsSelector } from './../notifications';

// Header activity selectors

const filteredNotificationsSelector = createDeepEqualSelector(
    [entitiesArraySelector('notifications')],
    notifications => notifications.sortBy(a => a.get('createdAt')).reverse().take(5)
);

export const notificationsMenuSelector = createDeepEqualSelector(
    [
        globalSelector('accounts'),
        hydratedNotificationsSelector(filteredNotificationsSelector),
        statusSelector('notifications'),
    ],
    (accounts, notifications, notificationsStatus) => ({
        accounts,
        notifications,
        isFetching: notificationsStatus.get('isFetching'),
    })
);
