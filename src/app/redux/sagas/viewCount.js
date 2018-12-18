import { takeEvery } from 'redux-saga/effects';
import throttle from 'lodash/throttle';
import { dispatch } from 'app/clientRender';

import { GATE_SEND_MESSAGE } from '../constants/gate';
import { POST_NEED_VIEW_COUNT, POST_FETCH_VIEW_COUNT_SUCCESS } from '../constants/post';

const queue = new Set();
const loading = new Set();

export default function* watch() {
    yield takeEvery(POST_NEED_VIEW_COUNT, loadHistorical);
}

function* loadHistorical({ payload }) {
    if (!process.env.BROWSER) {
        return;
    }

    const { postLink } = payload;

    if (!queue.has(postLink) && !loading.has(postLink)) {
        queue.add(postLink);

        startLoadingLazy();
    }
}

let reloadTimeout = null;

async function startLoading() {
    clearTimeout(reloadTimeout);

    if (!queue.size) {
        return;
    }

    const load = Array.from(queue);

    for (const date of queue) {
        loading.add(date);
    }

    queue.clear();

    dispatch({
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

const startLoadingLazy = throttle(startLoading, 150, { leading: false });
