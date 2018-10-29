import { UI_ON_BACK_CLICK } from '../constants/ui';

export const onBackClick = () => ({
    type: UI_ON_BACK_CLICK,
    payload: {
        timestamp: Date.now(),
    },
});
