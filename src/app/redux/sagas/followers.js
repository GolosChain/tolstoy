import { call, takeEvery, takeLatest, put } from 'redux-saga/effects';
import { api } from 'golos-js';

import { fetchFollowCount } from 'app/redux/sagas/follow';
import {
    USER_FOLLOW_DATA_LOAD,
    FOLLOWERS_GET_FOLLOWERS,
    FOLLOWERS_GET_FOLLOWERS_SUCCESS,
    FOLLOWERS_GET_FOLLOWING,
    FOLLOWERS_GET_FOLLOWING_SUCCESS,
} from 'src/app/redux/constants/followers';

export default function* watch() {
    yield takeEvery(USER_FOLLOW_DATA_LOAD, loadUserFollowData);
    yield takeLatest(FOLLOWERS_GET_FOLLOWERS, getFollowers);
    yield takeLatest(FOLLOWERS_GET_FOLLOWING, getFollowing);
}

// TODO: need to refactoring while merging with Post PR
function* loadUserFollowData({ payload }) {
    yield call(fetchFollowCount, payload.username);
}

export function* getFollowers({
    payload: { following, startFollower = '', followType = 'blog', limit = 100 },
}) {
    const result = yield call(
        [api, api.getFollowersAsync],
        following,
        startFollower,
        followType,
        limit
    );

    if (result.length) {
        const names = result.map(item => item.follower);
        const accounts = yield call([api, api.getAccountsAsync], names);
        yield put({
            type: 'global/RECEIVE_ACCOUNTS',
            payload: {
                accounts,
            },
        });
    }

    yield put({
        type: FOLLOWERS_GET_FOLLOWERS_SUCCESS,
        payload: result,
        meta: { following, startFollower, followType, limit },
    });
}

export function* getFollowing({
    payload: { follower, startFollowing = '', followType = 'blog', limit = 100 },
}) {
    const result = yield call(
        [api, api.getFollowingAsync],
        follower,
        startFollowing,
        followType,
        limit
    );

    if (result.length) {
        const names = result.map(item => item.following);
        const accounts = yield call([api, api.getAccountsAsync], names);
        yield put({
            type: 'global/RECEIVE_ACCOUNTS',
            payload: {
                accounts,
            },
        });
    }

    yield put({
        type: FOLLOWERS_GET_FOLLOWING_SUCCESS,
        payload: result,
        meta: { follower, startFollowing, followType, limit },
    });
}
