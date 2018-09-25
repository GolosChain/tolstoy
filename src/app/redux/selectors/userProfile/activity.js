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

// Prepare all data for render notifications on activity page
const hydratedNotificationsSelector = createDeepEqualSelector(
    [
        filteredNotificationsSelector,
        pageAccountSelector,
        globalSelector('accounts'),
        globalSelector('content'),
    ],
    (notifications, account, accounts, contents) =>
        notifications.map((notification, key) =>
            notification.withMutations(notify => {
                // Add content title and link from store data
                const eventType = notify.get('eventType');
                if (
                    [
                        'vote',
                        'flag',
                        'repost',
                        'reply',
                        'mention',
                        'reward',
                        'curatorReward',
                    ].includes(eventType)
                ) {
                    let author = '';
                    if (['vote', 'flag', 'reward'].includes(eventType)) {
                        author = account.get('name');
                    } else if (['curatorReward'].includes(eventType)) {
                        author = notify.get('curatorTargetAuthor');
                    } else if (['repost', 'reply', 'mention'].includes(eventType)) {
                        author = notify.get('fromUsers').get(0);
                    }

                    const content = contents.getIn([`${author}/${notify.get('permlink')}`]);
                    if (content) {
                        // if it isn't post
                        if (content.get('parent_author')) {
                            notify.setIn(
                                ['computed'],
                                fromJS({
                                    title: content.get('root_title'),
                                    link: content.get('url'),
                                })
                            );
                        } else {
                            notify.setIn(
                                ['computed'],
                                fromJS({
                                    title: content.get('title'),
                                    link: `/@${content.get('author')}/${content.get('permlink')}`,
                                })
                            );
                        }
                    }
                }

                // Add users from store data
                const computedAccounts = notify
                    .get('fromUsers')
                    .map(userName => accounts.get(userName.toLowerCase()));
                notify.setIn(['computed', 'accounts'], computedAccounts);

                // skip first element, because we don't need date label before first element
                if (key == 0) {
                    return notify;
                }

                // Check that this notification have next day date
                const prevNotify = notifications.get(key - 1);
                const isNextDay =
                    new Date(prevNotify.get('createdAt')).toDateString() !==
                    new Date(notify.get('createdAt')).toDateString();
                notify.set('isNextDay', isNextDay);

                return notify;
            })
        )
);

export const activityContentSelector = createDeepEqualSelector(
    [
        pageAccountSelector,
        globalSelector('accounts'),
        hydratedNotificationsSelector,
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
