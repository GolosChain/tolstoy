import { takeLatest } from 'redux-saga/effects';
import {SHOW_VOTED_USERS} from 'src/app/redux/constants/votedUsers';

export default function* showVotedUserWatcher() {
    yield takeLatest(SHOW_VOTED_USERS, showVotedUserWorker);
}

function* showVotedUserWorker(action) {
    console.log(action);
}
