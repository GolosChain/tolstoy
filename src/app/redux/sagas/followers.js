import { fork, call, takeEvery } from 'redux-saga/effects';
import { USER_FOLLOW_DATA_LOAD, USER_PINNED_POSTS_LOAD } from '../constants/followers';
import { fetchFollowCount } from 'app/redux/sagas/follow';
import { getContent } from 'app/redux/sagas/shared';

export default function* watch() {
    yield fork(watchForUserFollowData);
    yield fork(watchForUserPinnedPost);
}

function* watchForUserFollowData() {
    yield takeEvery(USER_FOLLOW_DATA_LOAD, loadUserFollowData);
}

function* watchForUserPinnedPost() {
    yield takeEvery(USER_PINNED_POSTS_LOAD, loadUserPinnedPosts);
}

function* loadUserFollowData({ payload }) {
    yield call(fetchFollowCount, payload.username);
}

function* loadUserPinnedPosts({ payload }) {
    const { urls } = payload;
    for (let i = 0; i < urls.length; i++) {
        let params = urls[i].split('/');
        yield fork(getContent, { author: params[0], permlink: params[1] });
    }
}
