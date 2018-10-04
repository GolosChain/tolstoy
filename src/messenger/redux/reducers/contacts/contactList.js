import { fromJS, Map } from 'immutable';

import {
    CONTACTS_GET_CONTACTS_LIST_SIZE_SUCCESS,
    CONTACTS_GET_CONTACTS_LIST_SUCCESS
} from 'src/messenger/redux/constants/contacts';

const initialState = Map({
    size: Map(),
    contactsList: Map()
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case CONTACTS_GET_CONTACTS_LIST_SIZE_SUCCESS:
            return state.set('size', fromJS(payload));
        case CONTACTS_GET_CONTACTS_LIST_SUCCESS:
            return state.set('contactsList', fromJS(payload));
        default:
            return state;
    }
}
