import {
  SET_SCREEN_ID,
  SET_PHONE_NUMBER,
  SET_LOC_DATA,
  SET_WISH_USERNAME,
  CLEAN_REGISTRATION_DATA,
} from 'store/constants';

const initialState = {
  screenId: '',
  locData: {
    code: '',
    country: '',
  },
  phoneNumber: '',
  wishUsername: '',
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_SCREEN_ID:
      return {
        ...state,
        screenId: payload.id,
      };

    case SET_PHONE_NUMBER:
      return {
        ...state,
        phoneNumber: payload.phoneNumber,
      };

    case SET_LOC_DATA:
      return {
        ...state,
        locData: payload.locData,
      };

    case SET_WISH_USERNAME:
      return {
        ...state,
        wishUsername: payload.wishUsername,
      };

    case CLEAN_REGISTRATION_DATA:
      return initialState;

    default:
      return state;
  }
}
