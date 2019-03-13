import { connect } from 'react-redux';

import { NOTIFICATIONS_FILTER_TYPES } from 'src/app/redux/constants/common';
import {
  createDeepEqualSelector,
  entitiesArraySelector,
  statusSelector,
  uiSelector,
  routerParamSelector,
} from 'src/app/redux/selectors/common';
import { hydratedNotificationsSelector } from 'src/app/redux/selectors/notifications';
import { getNotificationsHistory } from 'src/app/redux/actions/notifications';
import { changeProfileActivityTab } from 'src/app/redux/actions/ui';
import { authProtection } from 'src/helpers/hoc';

import ActivityContent from './ActivityContent';

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

export default authProtection()(
  connect(
    createDeepEqualSelector(
      [
        hydratedNotificationsSelector(filteredNotificationsSelector),
        statusSelector('notifications'),
        uiSelector('profile'),
        routerParamSelector('accountName'),
      ],
      (notifications, notificationsStatus, profileUi, accountName) => ({
        notifications,
        isFetching: notificationsStatus.get('isFetching'),
        currentTabId: profileUi.getIn(['activity', 'currentTabId']),
        pageAccountName: accountName.toLowerCase(),
      })
    ),
    {
      getNotificationsHistory,
      changeProfileActivityTab,
    }
  )(ActivityContent)
);
