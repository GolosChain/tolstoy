import { call, takeEvery } from 'redux-saga/effects';

import { loginIfNeed } from './login';
import { SHOW_DIALOG } from 'src/app/redux/constants/dialogs';
import DialogManager from 'app/components/elements/common/DialogManager';

export default function* watch() {
    yield takeEvery(SHOW_DIALOG, watchShowDialog);
}

function* watchShowDialog({ payload }) {
    if (payload.needAuth) {
        const logged = yield call(loginIfNeed);

        if (!logged) {
            return;
        }
    }

    DialogManager.showDialog(payload);
}
