import { fork } from 'redux-saga/effects';

import { userWatches } from 'app/redux/sagas/user';
import { fetchDataWatches } from 'app/redux/sagas/fetchData';
import { sharedWatches } from 'app/redux/sagas/shared';
import { transactionWatches } from 'app/redux/sagas/transaction';
import { marketWatches } from 'app/redux/sagas/market';

import userNewWatches from 'src/app/redux/sagas/user';
import gateWatches from 'src/app/redux/sagas/gate';
import notificationsOnlineWatches from 'src/app/redux/sagas/notificationsOnline';
import favoritesWatch from 'src/app/redux/sagas/favorites';
import pinnedPostsWatch from 'src/app/redux/sagas/pinnedPosts';
import userOnlineWatch from 'src/app/redux/sagas/userOnline';
import ratesWatch from 'src/app/redux/sagas/rates';
import viewCountWatch from 'src/app/redux/sagas/viewCount';
import followersWatch from 'src/app/redux/sagas/followers';
import loginWatch from 'src/app/redux/sagas/login';
import dialogsWatch from 'src/app/redux/sagas/dialogs';

import messenger from 'src/messenger/redux/sagas';
import showVotedUserWatcher from 'src/app/redux/sagas/voters';

export default function* rootSaga() {
    yield fork(userWatches);
    yield fork(userNewWatches);
    yield fork(fetchDataWatches);
    yield fork(sharedWatches);
    yield fork(transactionWatches);
    yield fork(marketWatches);

    yield fork(gateWatches);
    yield fork(notificationsOnlineWatches);
    yield fork(favoritesWatch);
    yield fork(showVotedUserWatcher);
    yield fork(pinnedPostsWatch);
    yield fork(userOnlineWatch);
    yield fork(ratesWatch);
    yield fork(viewCountWatch);
    yield fork(followersWatch);
    yield fork(loginWatch);
    yield fork(dialogsWatch);

    yield fork(messenger);
}
