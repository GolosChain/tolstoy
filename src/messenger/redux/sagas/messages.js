import { call, takeLatest, select, put } from 'redux-saga/effects';

import { api } from 'mocks/golos-js';

import { processMessages } from 'src/messenger/utils/messages';
import { MESSAGES_GET_THREAD_SUCCESS } from 'src/messenger/redux/constants/messages';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { getCurrentUserPrivateMemoKey } from 'src/messenger/redux/selectors/common';

export default function* watch() {
    yield takeLatest('messages/GET_THREAD', getThread);
}

function* getThread({ payload }) {
    const from = yield select(currentUsernameSelector);
    const memoPrivate = yield select(getCurrentUserPrivateMemoKey);
    const selectedContact = payload;

    const rawMessages = yield call(
        [api, api.getThreadAsync],
        from,
        selectedContact,
        {
            unread_only: false,
            limit: 100,
            offset: 0,
        }
    );

    const messages = processMessages(from, memoPrivate, rawMessages);

    yield put({
        type: MESSAGES_GET_THREAD_SUCCESS,
        payload: {
            messages,
            selectedContact,
        }
    });
}
