import { call, takeEvery, put } from 'redux-saga/effects';
import { api } from 'golos-js';

import {
    GET_VOTERS_USERS_REQUEST,
    GET_VOTERS_USERS_ERROR,
} from 'src/app/redux/constants/voters';
import GlobalReducer from 'app/redux/GlobalReducer';

export default function* showVotedUserWatcher() {
    yield takeEvery(GET_VOTERS_USERS_REQUEST, getVotersWorker)
}

function* getVotersWorker({payload: {postLink, limit}}) {
    const author = postLink.split('/')[0];
    const permlink = postLink.split('/')[1];
    try {
        const voters = yield call(
            [api, api.getActiveVotes],
            author,
            permlink,
            limit
        );

        if (voters.length) {
            const names = voters.map(item => item.voter);
            const accounts = yield call([api, api.getAccountsAsync], names);
            yield put({
                type: 'global/RECEIVE_ACCOUNTS',
                payload: {
                    accounts,
                },
            });
        }

        yield put(GlobalReducer.actions.getVotersUsersSuccess({voters, postLink}));
    } catch (error) {
        yield put({
            type: GET_VOTERS_USERS_ERROR,
            payload: {
                error
            }
        });
    }
}
