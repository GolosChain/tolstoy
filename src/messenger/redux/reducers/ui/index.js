import { fromJS, Map } from 'immutable';

import {
    UI_SEARCH_SHOW_RESULTS,
    UI_SEARCH_HIDE_RESULTS,
    UI_SELECT_CHAT,
} from 'src/messenger/redux/constants/ui';

const initialState = Map({
    showSearchResults: false,
    selectedChat: Map(),
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case UI_SEARCH_SHOW_RESULTS:
            return state.set('showSearchResults', true);
        case UI_SEARCH_HIDE_RESULTS:
            return state.set('showSearchResults', false);
        case UI_SELECT_CHAT:
            return state.set('selectedChat', fromJS(payload));
        default:
            return state;
    }
}
