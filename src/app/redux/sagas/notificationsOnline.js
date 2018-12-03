import { fork, put, all, takeEvery } from 'redux-saga/effects';
import { fromJS } from 'immutable';

import { createAddNotificationOnlineAction } from 'src/app/redux/actions/notificationsOnline';
import { NOTIFICATION_ONLINE_ADD_NOTIFICATION } from 'src/app/redux/constants/notificationsOnline';

import { checkSmallScreen } from 'src/app/helpers/window';

import { hydrateNotifications } from 'src/app/redux/sagas/actions/notifications';

export default function* watch() {
    yield fork(addNotificationsOnlineWatch);
}

function* addNotificationsOnlineWatch() {
    yield takeEvery(NOTIFICATION_ONLINE_ADD_NOTIFICATION, handleAddNotification);
}

// TODO: look in cache before call to api
function* handleAddNotification(action) {
    const notifications = action.payload;
    yield hydrateNotifications(notifications);

    if (checkSmallScreen()) {
        return;
    }

    yield all([
        notifications.map(function*(notification) {
            yield put(createAddNotificationOnlineAction(fromJS(notification)));
        }),
    ]);
}
