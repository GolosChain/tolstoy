import DialogManager from 'app/components/elements/common/DialogManager';
import RepostDialog from 'src/app/components/dialogs/RepostDialog';

export function openRepostDialog(postLink) {
    DialogManager.showDialog({
        component: RepostDialog,
        props: {
            postLink,
        },
    });
}
