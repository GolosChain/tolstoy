import { fork, put, all, takeEvery } from 'redux-saga/effects';
import { fromJS } from 'immutable';

import {
    NOTIFICATION_ONLINE_ADD_NOTIFICATION,
    NOTIFICATION_ONLINE_MARK_AS_READ,
} from 'src/app/redux/constants/notificationsOnline';

import {
    createAddNotificationOnlineAction,
    getNotificationsOnlineHistoryFreshCount,
} from 'src/app/redux/actions/notificationsOnline';

import { checkSmallScreen } from 'src/app/helpers/window';

import { hydrateNotifications } from 'src/app/redux/sagas/actions/notifications';
import { getGateSocket } from 'src/app/helpers/gate';
import { sleep } from 'src/app/helpers/time';

export default function* watch() {
    yield fork(addNotificationsOnlineWatch);
    yield fork(markReadWatch);
}

function* addNotificationsOnlineWatch() {
    yield takeEvery(NOTIFICATION_ONLINE_ADD_NOTIFICATION, handleAddNotification);
}

function* markReadWatch() {
    yield takeEvery(NOTIFICATION_ONLINE_MARK_AS_READ, markReadLazy);
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

let readQueue = new Set();
let currentExecuting = new Set();

function* markReadLazy({ payload }) {
    const { id } = payload;

    if (currentExecuting.has(id) || readQueue.has(id)) {
        return;
    }

    readQueue.add(id);

    yield sleep(300);

    if (!readQueue.size) {
        return;
    }

    const currentQuery = Array.from(readQueue);
    readQueue = new Set();

    for (let id of currentQuery) {
        currentExecuting.add(id);
    }
    try {
        const socket = yield getGateSocket();
        yield socket.call('notify.markAsViewed', { ids: currentQuery });
    } catch (err) {
        console.warn(err);
    }

    for (const id of currentQuery) {
        currentExecuting.delete(id);
    }

    yield put(getNotificationsOnlineHistoryFreshCount());
}
