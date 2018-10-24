import { call, takeEvery } from 'redux-saga/effects';

import { SHOW_REPOST, SHOW_PROMOTE } from '../../constants/dialogs';
import { loginIfNeed } from 'src/app/redux/sagas/login';
import DialogManager from 'app/components/elements/common/DialogManager';
import PromoteDialog from 'src/app/components/dialogs/PromoteDialog';
import RepostDialog from 'src/app/components/dialogs/RepostDialog';

export default function* watch() {
    yield takeEvery(SHOW_PROMOTE, watchPromote);
    yield takeEvery(SHOW_REPOST, watchRepost);
}

function* watchPromote(action) {
    const logged = yield call(loginIfNeed);

    if (!logged) {
        return;
    }

    DialogManager.showDialog({
        component: PromoteDialog,
        props: {
            postLink: action.payload.postLink,
        },
    });
}

function* watchRepost(action) {
    const logged = yield call(loginIfNeed);

    if (!logged) {
        return;
    }

    DialogManager.showDialog({
        component: RepostDialog,
        props: {
            postLink: action.payload.postLink,
        },
    });
}
