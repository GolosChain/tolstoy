import { fromJS } from 'immutable';
import {
    GET_VOTERS_USERS_REQUEST,
    GET_VOTERS_USERS_SUCCESS,
    GET_VOTERS_USERS_ERROR
} from 'src/app/redux/constants/voters';

const initialState = fromJS({
    loading: false,
});

export default function votersDialog(state = initialState, { type }) {
    switch (type) {
        case GET_VOTERS_USERS_REQUEST:
            return state.set('loading', true);
        case GET_VOTERS_USERS_SUCCESS:
        case GET_VOTERS_USERS_ERROR:
            return state.set('loading', false);
    }

    return state;
}
