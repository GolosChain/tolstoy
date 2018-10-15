import { fork } from 'redux-saga/effects';

import { userWatches } from 'app/redux/sagas/user';
import { fetchDataWatches } from 'app/redux/sagas/fetchData';
import { sharedWatches } from 'app/redux/sagas/shared';
import { authWatches } from 'app/redux/sagas/auth';
import { transactionWatches } from 'app/redux/sagas/transaction';
import { marketWatches } from 'app/redux/sagas/market';

import gateWatches from 'src/app/redux/sagas/gate';
import notificationsOnlineWatches from 'src/app/redux/sagas/notificationsOnline';
import favoritesWatch from 'src/app/redux/sagas/favorites';
import pinnedPostsWatch from 'src/app/redux/sagas/pinnedPosts';
import ratesWatch from 'src/app/redux/sagas/rates';
import followersWatch from 'src/app/redux/sagas/followers';
import loginWatch from 'src/app/redux/sagas/login';

import messenger from 'src/messenger/redux/sagas';

export default function* rootSaga() {
    yield fork(userWatches);
    yield fork(fetchDataWatches);
    yield fork(sharedWatches);
    yield fork(authWatches);
    yield fork(transactionWatches);
    yield fork(marketWatches);

    yield fork(gateWatches);
    yield fork(notificationsOnlineWatches);
    yield fork(favoritesWatch);
    yield fork(pinnedPostsWatch);
    yield fork(ratesWatch);
    yield fork(followersWatch);
    yield fork(loginWatch);

    yield fork(messenger);
}
