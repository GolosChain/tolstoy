import { UI_ON_BACK_CLICK } from '../constants/ui';
import { POST_NEED_VIEW_COUNT } from '../constants/post';
import { getGateSocket } from '../../helpers/gate';

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

export const recordPostView = (postLink, fingerPrint) => async () => {
    const gate = await getGateSocket();

    await gate.call('meta.recordPostView', {
        postLink,
        fingerPrint,
    });
};
