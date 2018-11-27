import tt from 'counterpart';

import { CLOSED_LOGIN_DIALOG } from 'src/app/redux/constants/common';
import DialogManager from 'app/components/elements/common/DialogManager/index';

export function processError(err) {
    const errStr = err.toString();
    switch (errStr) {
        case CLOSED_LOGIN_DIALOG:
        case 'Canceled':
            return;
        case 'Missing object (1020200)':
            DialogManager.alert(`${tt('g.error')}:\n${tt('g.account_not_found')}`);
            break;
        default:
            DialogManager.alert(`${tt('g.error')}:\n${errStr}`);
    }
}
