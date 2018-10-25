import { SHOW_DIALOG } from 'src/app/redux/constants/dialogs';

import {
    PromoteDialog,
    RepostDialog,
    ConvertDialog,
    DelegateVestingDialog,
    TransferDialog,
    SafeDialog,
} from 'src/app/components/dialogs';

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

export function openTransferDialog(toAccountName) {
    return {
        type: SHOW_DIALOG,
        payload: {
            needAuth: true,
            component: TransferDialog,
            props: {
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
