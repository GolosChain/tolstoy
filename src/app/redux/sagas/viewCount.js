import { takeEvery, throttle } from 'redux-saga/effects';

import { GATE_SEND_MESSAGE } from '../constants/gate';
import { POST_NEED_VIEW_COUNT, POST_FETCH_VIEW_COUNT_SUCCESS } from '../constants/post';

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

    yield put({
        type: GATE_SEND_MESSAGE,
        payload: {
            method: 'meta.getPostsViewCount',
            types: [null, POST_FETCH_VIEW_COUNT_SUCCESS],
            data: { postLinks: load },
            successCallback: onDone,
            errorCallback: onDone,
        },
    });

    function onDone() {
        for (const link of load) {
            loading.delete(link);
        }
    }
}
