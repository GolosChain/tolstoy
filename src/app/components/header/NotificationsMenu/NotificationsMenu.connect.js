import { connect } from 'react-redux';

import {
    createDeepEqualSelector,
    entitiesArraySelector,
    statusSelector,
} from 'src/app/redux/selectors/common';
import { hydratedNotificationsSelector } from 'src/app/redux/selectors/notifications';

import NotificationsMenu from './NotificationsMenu';

const filteredNotificationsSelector = createDeepEqualSelector(
    [entitiesArraySelector('notificationsOnline')],
    notifications =>
        notifications
            .sortBy(a => a.get('createdAt'))
            .reverse()
            .take(5)
);

export default connect(
    createDeepEqualSelector(
        [
            hydratedNotificationsSelector(filteredNotificationsSelector),
            statusSelector('notificationsOnline')
        ],
        (notifications, notificationsStatus) => ({
            notifications,
            isFetching: notificationsStatus.get('isFetching'),
        })
    )
)(NotificationsMenu);
