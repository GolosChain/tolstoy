import {
    UI_COMMON_SAVE_SCROLL_POSITION,
    UI_PROFILE_CHANGE_LAYOUT,
    UI_PROFILE_ACTIVITY_CHANGE_TAB,
    UI_HOME_TAGS_CARD_COLLAPSE,
    UI_TOGGLE_COMMENT_INPUT_FOCUS,
} from 'src/app/redux/constants/ui';
import { UI_SET_WALLET_TAB_STATE, UI_SET_WALLET_TABS_STATE } from '../constants/ui';

export function saveListScrollPosition(y) {
    return {
        type: UI_COMMON_SAVE_SCROLL_POSITION,
        payload: { y },
    };
}

export function changeProfileLayout(payload) {
    return { type: UI_PROFILE_CHANGE_LAYOUT, payload };
}

export function changeProfileActivityTab(payload) {
    return { type: UI_PROFILE_ACTIVITY_CHANGE_TAB, payload };
}

export function changeHomeTagsCardCollapse(payload) {
    return { type: UI_HOME_TAGS_CARD_COLLAPSE, payload };
}

export function showNotification(text, keyPrefix, dismissDelay = 5000) {
    return {
        type: 'ADD_NOTIFICATION',
        payload: {
            key: keyPrefix ? keyPrefix + Date.now() : undefined,
            message: text,
            dismissAfter: dismissDelay,
        },
    };
}

export function toggleCommentInputFocus(focused) {
    return {
        type: UI_TOGGLE_COMMENT_INPUT_FOCUS,
        payload: { focused },
    };
}

export function setWalletTabState(tab) {
    return {
        type: UI_SET_WALLET_TAB_STATE,
        payload: { tab },
    };
}

export function setWalletTabsState(tabs) {
    return {
        type: UI_SET_WALLET_TABS_STATE,
        payload: { tabs },
    };
}
