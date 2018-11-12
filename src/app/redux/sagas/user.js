import { fromJS } from 'immutable';
import { call, put, select, fork, takeLatest, takeEvery } from 'redux-saga/effects';
import { api } from 'golos-js';

import user from 'app/redux/User';
import g from 'app/redux/GlobalReducer';

export default function* watch() {
    yield fork(function*() {
        yield takeLatest('user/LOAD_SAVINGS_WITHDRAW', loadSavingsWithdraw);
    });
    yield fork(function*() {
        yield takeEvery('user/GET_ACCOUNT', getAccountHandler);
    });
}

function* getAccountHandler({ payload: { usernames, resolve, reject } }) {
    if (!usernames) {
        const current = yield select(state => state.user.get('current'));

        if (!current) {
            return;
        }

        usernames = [current.get('username')];
    }

    const accounts = yield call([api, api.getAccountsAsync], usernames);

    yield accounts.map(account => put(g.actions.receiveAccount({ account })));

    if (accounts[0]) {
        if (resolve) {
            resolve(accounts);
        }
    } else if (reject) {
        reject();
    }
}

function* loadSavingsWithdraw() {
    const username = yield select(state => state.user.getIn(['current', 'username']));
    const to = yield call([api, api.getSavingsWithdrawToAsync], username);
    const from = yield call([api, api.getSavingsWithdrawFromAsync], username);

    const temp = {};

    for (let v of to) {
        temp[v.id] = v;
    }

    for (let v of from) {
        temp[v.id] = v;
    }

    const list = Array.from(temp.values()).sort((a, b) =>
        compareFunc(a.get('complete'), b.get('complete'))
    );

    yield put(
        user.actions.set({
            key: 'savings_withdraws',
            value: fromJS(list),
        })
    );
}

function compareFunc(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
