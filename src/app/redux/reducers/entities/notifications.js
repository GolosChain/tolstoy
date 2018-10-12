import { Map } from 'immutable';

const initialState = Map();

// Gets entities from redux-entities-immutable
export default function(state = initialState, { type, payload }) {
    switch (type) {
        default:
            return state;
    }
}
