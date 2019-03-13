import {
  FETCH_REG_STATE,
  FETCH_REG_STATE_SUCCESS,
  FETCH_REG_STATE_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  isLoadingRegState: false,
};

export default function(state = initialState, { type }) {
  switch (type) {
    case FETCH_REG_STATE:
      return {
        ...state,
        isLoadingRegState: true,
      };

    case FETCH_REG_STATE_SUCCESS: {
      return {
        ...state,
      };
    }

    case FETCH_REG_STATE_ERROR:
      return { ...state, isLoadingRegState: false };

    default:
      return state;
  }
}
