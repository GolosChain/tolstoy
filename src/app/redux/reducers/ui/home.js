import { fromJS } from 'immutable';
import {
    UI_HOME_TAGS_CARD_COLLAPSE
} from 'src/app/redux/constants/ui';

const initialState = fromJS({
    tagsCollapsed: true,
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case UI_HOME_TAGS_CARD_COLLAPSE:
            return state.set('tagsCollapsed', payload);
    }

    return state;
}