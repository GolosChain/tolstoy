import { takeEvery } from 'redux-saga/effects';

import { GATE_AUTHORIZED } from '../constants/gate';
import { getGateSocket } from 'src/app/helpers/gate';

let intervalId = null;
let lastOnlineSyncTs = null;

export default function* watch() {
    yield takeEvery(GATE_AUTHORIZED, onAuthorized);
    yield takeEvery('user/LOGOUT', onLogout);
}

function* onAuthorized() {
    markOnline();

    // Ключаем логику только если браузер поддерживает document.hidden api
    if (typeof document.hidden === 'boolean') {
        document.addEventListener('visibilityChange', checkState);
        checkState();
    }
}

function* onLogout() {
    console.log('LOGOUT');
    clearInterval(intervalId);
    document.removeEventListener('visibilityChange', checkState);
}

function checkState() {
    if (document.hidden) {
        if (!intervalId) {
            markOnline();
            intervalId = setInterval(markOnline, 2 * 60 * 1000);
        }
    } else {
        clearInterval(intervalId);
        intervalId = null;
    }
}

async function markOnline() {
    const now = Date.now();

    if (!lastOnlineSyncTs || now - lastOnlineSyncTs < 60 * 1000) {
        lastOnlineSyncTs = now;

        try {
            await getGateSocket().call('meta.markUserOnline', {});
        } catch (err) {
            console.warn('Calling "meta.markUserOnline" failed:', err);
        }
    }
}
