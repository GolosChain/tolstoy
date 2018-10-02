import { fromJS } from 'immutable';
import { UI_LOCATION_CHANGED } from 'src/app/redux/constants/ui';

const initialState = fromJS({
    current: null,
    previous: null,
});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case UI_LOCATION_CHANGED:
            return state.set('previous', state.get('current')).set('current', fromJS(payload));
    }

    return state;
}
