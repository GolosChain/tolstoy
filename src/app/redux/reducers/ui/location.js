import { fromJS } from 'immutable';
import { UI_LOCATION_CHANGED } from 'src/app/redux/constants/ui';

const initialState = fromJS({});

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case UI_LOCATION_CHANGED:
            return fromJS(payload);
    }

    return state;
}
