import DialogManager from 'app/components/elements/common/DialogManager';
import RepostDialog from 'src/app/components/dialogs/RepostDialog';
import PromoteDialog from 'src/app/components/dialogs/PromoteDialog';

export function openRepostDialog(postLink) {
    DialogManager.showDialog({
        component: RepostDialog,
        props: {
            postLink,
        },
    });
}

export function openPromoteDialog(postLink) {
    DialogManager.showDialog({
        component: PromoteDialog,
        props: {
            postLink,
        },
    });
}
