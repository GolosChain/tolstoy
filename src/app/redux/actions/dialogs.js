import { SHOW_PROMOTE, SHOW_REPOST } from '../constants/dialogs';

export function openPromoteDialog(postLink) {
    return {
        type: SHOW_PROMOTE,
        payload: {
            postLink,
        },
    };
}

export function openRepostDialog(postLink) {
    return {
        type: SHOW_REPOST,
        payload: {
            postLink,
        },
    };
}
