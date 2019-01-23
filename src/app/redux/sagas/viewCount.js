import { call, put, takeEvery, throttle } from 'redux-saga/effects';

import { POST_NEED_VIEW_COUNT, POST_FETCH_VIEW_COUNT_SUCCESS } from '../constants/post';
import { getGateSocket } from '../../helpers/gate';

const queue = new Set();
const loading = new Set();

export default function* watch() {
    yield takeEvery(POST_NEED_VIEW_COUNT, addPostInQuery);
    yield throttle(150, POST_NEED_VIEW_COUNT, fetchViewCounts);
}

function* addPostInQuery({ payload }) {
    const { postLink } = payload;

    if (!queue.has(postLink) && !loading.has(postLink)) {
        queue.add(postLink);
    }
}

function* fetchViewCounts() {
    if (!queue.size) {
        return;
    }

    const load = Array.from(queue);

    for (const date of queue) {
        loading.add(date);
    }

    queue.clear();

    const gate = yield call(getGateSocket);

    try {
        const result = yield call([gate, gate.call], 'meta.getPostsViewCount', {
            postLinks: load,
        });

        yield put({
            type: POST_FETCH_VIEW_COUNT_SUCCESS,
            payload: result,
        });
    } catch (err) {
        console.warn(err);
    }

    for (const link of load) {
        loading.delete(link);
    }
}
