import { SHOW_DIALOG } from '../constants/dialogs';
import PromoteDialog from 'src/app/components/dialogs/PromoteDialog';
import RepostDialog from 'src/app/components/dialogs/RepostDialog';

export function openPromoteDialog(postLink) {
    return {
        type: SHOW_DIALOG,
        payload: {
            needAuth: true,
            component: PromoteDialog,
            props: {
                postLink,
            },
        },
    };
}

export function openRepostDialog(postLink) {
    return {
        type: SHOW_DIALOG,
        payload: {
            needAuth: true,
            component: RepostDialog,
            props: {
                postLink,
            },
        },
    };
}
