import { Map, fromJS } from 'immutable';
import { FETCH_COMMENTS_SUCCESS } from 'src/app/redux/constants/comments';

const initialState = Map();

export default function(state = initialState, { type, permLink, comments }) {
    switch (type) {
        case FETCH_COMMENTS_SUCCESS:
            return state.set(permLink, fromJS(comments));

        default:
            return state
    }
}
