import { fromJS } from 'immutable';
import {
    UI_COMMON_SAVE_SCROLL_POSITION,
    UI_ON_BACK_CLICK,
    UI_TOGGLE_COMMENT_INPUT_FOCUS,
} from 'src/app/redux/constants/ui';

const initialState = fromJS({
    listScrollPosition: 0,
    commentInputFocused: false,
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case UI_COMMON_SAVE_SCROLL_POSITION:
            return state.set('listScrollPosition', payload.y);
        case UI_ON_BACK_CLICK:
            return state.set('backClickTs', payload.timestamp).set('backUrl', payload.backUrl);
        case UI_TOGGLE_COMMENT_INPUT_FOCUS:
            return state.set('commentInputFocused', payload.focused);
    }

    return state;
}
