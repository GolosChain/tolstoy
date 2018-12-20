import { UI_ON_BACK_CLICK } from '../constants/ui';
import { GATE_SEND_MESSAGE } from '../constants/gate';
import { POST_NEED_VIEW_COUNT } from '../constants/post';

export const onBackClick = backUrl => ({
    type: UI_ON_BACK_CLICK,
    payload: {
        timestamp: Date.now(),
        backUrl,
    },
});

export const fetchViewCount = postLink => ({
    type: POST_NEED_VIEW_COUNT,
    payload: {
        postLink,
    },
});

export const recordPostView = (postLink, fingerPrint) => ({
    type: GATE_SEND_MESSAGE,
    payload: {
        method: 'meta.recordPostView',
        data: {
            postLink,
            fingerPrint,
        },
    },
});
