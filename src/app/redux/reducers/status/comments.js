import { fromJS } from 'immutable';
import {
    FETCH_COMMENTS,
    FETCH_COMMENTS_ERROR,
    FETCH_COMMENTS_SUCCESS,
} from 'src/app/redux/constants/comments';

const initialState = fromJS({
    isFetching: false,
    error: null,
});

export default function(state = initialState, { type, error }) {
    switch (type) {
        case FETCH_COMMENTS:
            return state.set('isFetching', true);

        case FETCH_COMMENTS_SUCCESS:
            return state.set('isFetching', false);

        case FETCH_COMMENTS_ERROR:
            return state.set('isFetching', false).set('error', error);

        default:
            return state;
    }
}
