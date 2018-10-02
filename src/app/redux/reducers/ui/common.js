import { fromJS } from 'immutable';
import { UI_COMMON_SAVE_SCROLL_POSITION } from 'src/app/redux/constants/ui';

const initialState = fromJS({
    listScrollPosition: 0,
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case UI_COMMON_SAVE_SCROLL_POSITION:
            return state.set('listScrollPosition', payload.y);
    }

    return state;
}
