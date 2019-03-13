import { AUTH_LOGIN_SUCCESS, AUTH_LOGIN_ERROR, AUTH_LOGOUT } from 'store/constants/actionTypes';

const initialState = {
  currentUser: null,
  error: null,
};

export default function(state = initialState, { type, payload, error }) {
  switch (type) {
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: payload.currentUser,
      };
    case AUTH_LOGIN_ERROR:
      return {
        ...state,
        error,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        currentUser: null,
      };
    default:
      return state;
  }
}
