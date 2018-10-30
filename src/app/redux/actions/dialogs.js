import { SHOW_DIALOG } from 'src/app/redux/constants/dialogs';

import {
    PromoteDialog,
    RepostDialog,
    ConvertDialog,
    DelegateVestingDialog,
    TransferDialog,
    SafeDialog,
} from 'src/app/components/dialogs';
import VotersDialog from 'src/app/components/dialogs/VotersDialog';
import UnfollowDialog from 'src/app/components/dialogs/UnfollowDialog';

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

export function openConvertDialog() {
    return {
        type: SHOW_DIALOG,
        payload: {
            needAuth: true,
            component: ConvertDialog,
        },
    };
}

export function openDelegateVestingDialog(toAccountName) {
    return {
        type: SHOW_DIALOG,
        payload: {
            needAuth: true,
            component: DelegateVestingDialog,
            props: {
                toAccountName,
            },
        },
    };
}

export function openTransferDialog(toAccountName, otherProps) {
    return {
        type: SHOW_DIALOG,
        payload: {
            needAuth: true,
            component: TransferDialog,
            props: {
                ...otherProps,
                toAccountName,
            },
        },
    };
}

export function openSafeDialog() {
    return {
        type: SHOW_DIALOG,
        payload: {
            needAuth: true,
            component: SafeDialog,
        },
    };
}

export function openVotersDialog(postLink, type = 'likes') {
    return {
        type: SHOW_DIALOG,
        payload: {
            needAuth: false,
            component: VotersDialog,
            props: {
                postLink,
                isLikes: type === 'likes',
            },
        },
    };
}
