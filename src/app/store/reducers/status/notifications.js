import { uniq, last } from 'ramda';

import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  AUTH_LOGOUT,
} from 'store/constants/actionTypes';

const initialState = {
  order: [],
  isLoading: false,
  isEnd: false,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_NOTIFICATIONS:
      if (meta.fromId && meta.fromId === state.lastId) {
        return {
          ...state,
          isLoading: true,
        };
      }

      return {
        ...initialState,
        isLoading: true,
      };

    case FETCH_NOTIFICATIONS_SUCCESS: {
      let order;

      // Если передан lastId и он соответствует текущей ленте то просто добавляем новые посты
      if (meta.fromId && meta.fromId === state.lastId) {
        order = uniq(state.order.concat(payload.result.data));
      } else {
        order = payload.result.data;
      }

      return {
        ...state,
        order,
        lastId: last(payload.result.data) || state.lastId,
        isLoading: false,
        isEnd: payload.result.data.length < meta.limit,
      };
    }

    case FETCH_NOTIFICATIONS_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case AUTH_LOGOUT:
      return initialState;

    default:
      return state;
  }
}
