import { fromJS } from 'immutable';
import {
    createDeepEqualSelector,
    globalSelector,
    entitiesArraySelector,
    statusSelector,
    uiSelector,
    pageAccountSelector,
    routerParamSelector,
} from './../common';
import {
    hydratedNotificationsSelector
} from './../notifications';
import { NOTIFICATIONS_FILTER_TYPES } from 'src/app/redux/constants/common';

// Activity selectors

const filteredNotificationsSelector = createDeepEqualSelector(
    [entitiesArraySelector('notifications'), uiSelector('profile')],
    (notifications, profileUi) => {
        const currentTabId = profileUi.getIn(['activity', 'currentTabId']);
        const types = NOTIFICATIONS_FILTER_TYPES[currentTabId];

        let filteredNotifications = notifications;
        if (currentTabId !== 'all') {
            filteredNotifications = notifications.filter(notification => {
                if (currentTabId == 'all') {
                    return true;
                }

                const eventType = notification.get('eventType');
                return types.includes(eventType);
            });
        }
        return filteredNotifications.sortBy(a => a.get('createdAt')).reverse();
    }
);

export const activityContentSelector = createDeepEqualSelector(
    [
        pageAccountSelector,
        globalSelector('accounts'),
        hydratedNotificationsSelector(filteredNotificationsSelector),
        statusSelector('notifications'),
        uiSelector('profile'),
        routerParamSelector('accountName'),
    ],
    (account, accounts, notifications, notificationsStatus, profileUi, accountName) => ({
        account,
        accounts,
        notifications,
        isFetching: notificationsStatus.get('isFetching'),
        currentTabId: profileUi.getIn(['activity', 'currentTabId']),
        pageAccountName: accountName.toLowerCase(),
    })
);
