import { POST_FETCH_VIEW_COUNT_SUCCESS } from '../../constants/post';

const initialState = {};

export default function(state = initialState, { type, payload }) {
    switch (type) {
        case POST_FETCH_VIEW_COUNT_SUCCESS:
            const newState = { ...state };

            for (const { postLink, viewCount } of payload.results) {
                newState[postLink] = viewCount;
            }

            return newState;
    }

    return state;
}
