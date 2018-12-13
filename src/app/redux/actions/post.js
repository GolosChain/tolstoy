import { UI_ON_BACK_CLICK } from '../constants/ui';

export const onBackClick = backUrl => ({
    type: UI_ON_BACK_CLICK,
    payload: {
        timestamp: Date.now(),
        backUrl,
    },
});
