import { call, takeEvery } from 'redux-saga/effects';
import {USER_FOLLOW_DATA_LOAD} from '../constants/followers';
import {fetchFollowCount} from '../../../../app/redux/sagas/follow';

export default function* watch() {
    yield takeEvery(USER_FOLLOW_DATA_LOAD, loadUserFollowData);
}

function* loadUserFollowData({ payload }) {
    yield call(fetchFollowCount, payload.username);
}
