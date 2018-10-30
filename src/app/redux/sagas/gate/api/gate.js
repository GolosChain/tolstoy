import { fork, take, call, put, cancel, select, actionChannel } from 'redux-saga/effects';
import { eventChannel, buffers } from 'redux-saga';
import golos from 'golos-js';
import { Client as WebSocket } from 'rpc-websockets';
import { normalize as normalizr } from 'normalizr';

import { makeFakeAuthTransaction } from './utils';
import { addNotificationOnline } from 'src/app/redux/actions/notificationsOnline';
import { showNotification } from 'src/app/redux/actions/ui';
import { getSettingsOptions } from 'src/app/redux/actions/settings';

import {
    GATE_SEND_MESSAGE,
    GATE_CONNECT,
    GATE_CONNECT_SUCCESS,
    GATE_AUTHORIZED,
    GATE_DISCONNECT,
} from 'src/app/redux/constants/gate';

export default function* rootSaga() {
    yield fork(flow);
}

function* flow() {
    const gateServiceUrl = yield select(state =>
        state.offchain.getIn(['config', 'gate_service_url'])
    );

    // Channel listen messages for writing
    const writeChannel = yield actionChannel(GATE_SEND_MESSAGE, buffers.expanding(10));

    while (true) {
        // Wait for user login
        yield take(`user/SET_USER`);

        yield put({ type: GATE_CONNECT });
        const socket = yield call(connect, gateServiceUrl);
        yield put({ type: GATE_CONNECT_SUCCESS });

        const task = yield fork(handleIO, socket, writeChannel);

        // Wait for user logout
        yield take(`user/LOGOUT`);

        yield cancel(task);
    }
}

// TODO: reconnect
function connect(gateServiceUrl) {
    const socket = new WebSocket(gateServiceUrl);
    return new Promise(resolve => {
        socket.on('open', () => resolve(socket));
    });
}

function* handleIO(socket, writeChannel) {
    yield fork(write, socket, writeChannel);
    yield fork(read, socket);
}

function* read(socket) {
    const channel = yield call(subscribe, socket);
    while (true) {
        const action = yield take(channel);
        yield put(action);
    }
}

function* write(socket, writeChannel) {
    // Wait for authorization on gate
    yield take(GATE_AUTHORIZED);

    while (true) {
        // TODO: need to cancel same request.?
        const action = yield take(writeChannel);
        const {
            payload: {
                types: [requestType, successType, failureType],
                method,
                data,
                normalize,
                successCallback,
                errorCallback,
            },
        } = action;

        const actionWith = data => ({ ...action, ...data });
        yield put(actionWith({ type: requestType }));
        try {
            const payload = yield call([socket, 'call'], method, data);
            let normalizedPayload = {};

            if (normalize) {
                const { transform, saga, schema } = normalize;
                // if we need to get result from unusual property
                if (transform) {
                    normalizedPayload = transform(payload);
                }
                // if exists saga for hydrate data from blockchain
                if (saga) {
                    normalizedPayload = yield call(saga, normalizedPayload);
                }
                if (schema) {
                    normalizedPayload = normalizr(normalizedPayload, schema);
                }
            }

            yield put(
                actionWith({ type: successType, payload: { ...payload, ...normalizedPayload } })
            );
            if (successCallback) {
                try {
                    successCallback();
                } catch (error) {
                    console.error(error);
                }
            }
        } catch (e) {
            console.error('Gate error:', e);

            yield put(showNotification(e.message));

            yield put(actionWith({ type: failureType, error: e.message }));
            if (errorCallback) errorCallback(e.message);
        }
    }
}

function* subscribe(socket) {
    const current = yield select(state => state.user.get('current'));
    const postingPrivateKey = current.getIn(['private_keys', 'posting_private']);
    const userName = current.get('username');

    return eventChannel(emit => {
        socket.on('sign', ({ secret }) => {
            const transaction = makeFakeAuthTransaction(userName, secret);
            const {
                signatures: [xsign],
            } = golos.auth.signTransaction(transaction, [postingPrivateKey]);

            socket
                .call('auth', {
                    user: userName,
                    sign: xsign,
                })
                .then(() => {
                    emit({ type: GATE_AUTHORIZED });

                    // load settings after authorization
                    emit(getSettingsOptions());

                    socket.call('onlineNotifyOn', {});
                });
        });

        socket.on('onlineNotify', ({ result }) => emit(addNotificationOnline(result)));

        return () => emit({ type: GATE_DISCONNECT });
    });
}
