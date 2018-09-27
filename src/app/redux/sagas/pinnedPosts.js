import { fork, put, select, takeEvery } from 'redux-saga/effects';
import transaction from 'app/redux/Transaction';
import DialogManager from 'app/components/elements/common/DialogManager';
import { dispatch } from 'app/clientRender';
import { PINNED_TOGGLE, USER_PINNED_POSTS_LOAD } from '../constants/pinnedPosts';
import {getContent} from 'app/redux/sagas/shared';

export default function* watch() {
    yield takeEvery(PINNED_TOGGLE, togglePinned);
    yield takeEvery(USER_PINNED_POSTS_LOAD, loadUserPinnedPosts);
}

function* togglePinned(action) {
    const { link, isPin } = action.payload;

    const userName = yield select(state => state.user.getIn(['current', 'username']));
    const account = yield select(state => state.global.getIn(['accounts', userName]));

    const metadata = JSON.parse(account.get('json_metadata'));

    let pinnedPosts = metadata.pinnedPosts || [];

    if (isPin) {
        if (pinnedPosts.includes(link)) {
            return;
        }

        if (pinnedPosts.length >= 5) {
            DialogManager.info(
                'Максимальное количество закрепленных постов в блоге - 5.\n\n' +
                    'Если вы хотите изменить список закрепленных постов, открепите один пост, чтобы закрепить другой.'
            );
            return;
        }

        pinnedPosts.push(link);
    } else {
        pinnedPosts = pinnedPosts.filter(pinnedLink => pinnedLink !== link);
    }

    metadata.pinnedPosts = pinnedPosts;

    yield put(
        transaction.actions.broadcastOperation({
            type: 'account_metadata',
            operation: {
                account: account.get('name'),
                memo_key: account.get('memo_key'),
                json_metadata: JSON.stringify(metadata),
            },
            successCallback: () => {
                dispatch({
                    type: 'global/PINNED_UPDATE',
                    payload: {
                        accountName: account.get('name'),
                        pinnedPosts,
                    },
                });
            },
            errorCallback: err => {
                console.error(err);
                DialogManager.alert('Не удалось выполнить запрос');
            },
        })
    );
}

function* loadUserPinnedPosts({ payload }) {
    const { urls } = payload;
    for (let i = 0; i < urls.length; i++) {
        let params = urls[i].split('/');
        yield fork(getContent, { author: params[0], permlink: params[1] });
    }
}

