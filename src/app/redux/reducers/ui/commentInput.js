import { fromJS } from 'immutable';
import { UI_TOGGLE_COMMENT_INPUT_FOCUS } from 'src/app/redux/constants/ui';

const initialState = fromJS({
    focused: false,
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case UI_TOGGLE_COMMENT_INPUT_FOCUS:
            return state.set('focused', payload);
    }

    return state;
}
