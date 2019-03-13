import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  AUTH_LOGOUT,
  CALL_MARK_AS_VIEWED_SUCCESS,
  CALL_MARK_ALL_AS_VIEWED_SUCCESS,
} from 'store/constants/actionTypes';

const initialState = {
  counter: 0,
};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_NOTIFICATIONS:
      if (!meta.fromId || meta.fromId !== state.lastId) {
        return initialState;
      }

      return state;

    case FETCH_NOTIFICATIONS_SUCCESS: {
      return {
        counter: payload.result.fresh,
      };
    }

    case AUTH_LOGOUT:
      return initialState;

    case CALL_MARK_AS_VIEWED_SUCCESS:
      return {
        counter: Math.max(0, state.counter - 1),
      };

    case CALL_MARK_ALL_AS_VIEWED_SUCCESS:
      return {
        counter: 0,
      };

    default:
      return state;
  }
}
