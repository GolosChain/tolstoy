import {
  FETCH_REG_STATE,
  FETCH_REG_STATE_ERROR,
  FETCH_REG_STATE_SUCCESS,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

// not real use action, just for test api
/* eslint-disable import/prefer-default-export */
export const fetchRegState = username => async dispatch =>
  dispatch({
    [CALL_GATE]: {
      types: [FETCH_REG_STATE, FETCH_REG_STATE_SUCCESS, FETCH_REG_STATE_ERROR],
      method: 'registration.getState',
      params: {
        user: username,
      },
    },
  });
