import { connect } from 'react-redux';

import {
    createDeepEqualSelector,
    currentUsernameSelector,
    entitiesArraySelector,
    statusSelector,
} from 'src/app/redux/selectors/common';
import { hydratedNotificationsSelector } from 'src/app/redux/selectors/notifications';
import { markAllNotificationsAsViewed } from 'src/app/redux/actions/notifications';
import {
    getNotificationsOnlineHistory,
    clearOnlineNotifications,
} from 'src/app/redux/actions/notificationsOnline';
import NotificationsMenu from './NotificationsMenu';

const filteredNotificationsSelector = createDeepEqualSelector(
    [entitiesArraySelector('notificationsOnline')],
    notifications =>
        notifications.sortBy(a => new Date(a.get('createdAt')).getTime(), (a, b) => b - a)
);

export default connect(
    createDeepEqualSelector(
        [
            hydratedNotificationsSelector(filteredNotificationsSelector),
            statusSelector('notificationsOnline'),
            currentUsernameSelector,
        ],
        (notifications, notificationsStatus, authorizedUsername) => ({
            notifications,
            isFetching: notificationsStatus.get('isFetching'),
            canLoadMore: notificationsStatus.get('canLoadMore'),
            lastLoadedId: notificationsStatus.get('lastLoadedId'),
            authorizedUsername,
        })
    ),
    { getNotificationsOnlineHistory, markAllNotificationsAsViewed, clearOnlineNotifications }
)(NotificationsMenu);
