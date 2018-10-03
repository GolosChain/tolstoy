import { Map } from 'immutable';
import { COMMENTS_SET_COMMENTS } from 'src/app/redux/constants/comments';

const initialState = Map();

export default function(state = initialState, { type, permLink, comments }) {
    switch (type) {
        case COMMENTS_SET_COMMENTS:
            return {
                ...state,
                [permLink]: {
                    comments,
                },
            };
    }

    return state;
}
