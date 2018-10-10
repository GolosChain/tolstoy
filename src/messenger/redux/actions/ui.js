import {
    UI_SEARCH_HIDE_RESULTS,
    UI_SELECT_CHAT,
} from 'src/messenger/redux/constants/ui';

export const closeSearchResults = () => ({
    type: UI_SEARCH_HIDE_RESULTS,
});

export const selectChat = (contact, type) => ({
    type: UI_SELECT_CHAT,
    payload: {
        contact,
        type,
    }
});
