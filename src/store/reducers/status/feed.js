import { uniq } from 'ramda';

import { FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR } from 'store/constants/actionTypes';

const initialState = {
  order: [],
  sequenceKey: null,
  isLoading: false,
  isEnd: false,
  error: null,
};

export default function(state = initialState, { type, payload, error, meta }) {
  switch (type) {
    case FETCH_POSTS:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_POSTS_SUCCESS: {
      let order;

      // Если передан sequenceKey и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.sequenceKey && meta.sequenceKey === state.sequenceKey) {
        order = uniq(state.order.concat(payload.result.items));
      } else {
        order = payload.result.items;
      }

      return {
        ...state,
        order,
        sequenceKey: payload.result.sequenceKey,
        isLoading: false,
        isEnd: payload.result.items.length < meta.limit,
        error: null,
      };
    }

    case FETCH_POSTS_ERROR:
      return {
        ...state,
        isLoading: false,
        error,
      };

    default:
      return state;
  }
}
