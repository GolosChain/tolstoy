import {
  SET_SCREEN_ID,
  SET_PHONE_NUMBER,
  SET_LOC_DATA,
  SET_WISH_USERNAME,
  CLEAN_REGISTRATION_DATA,
} from 'store/constants/actionTypes';

export function setScreenId(id) {
  return {
    type: SET_SCREEN_ID,
    payload: { id },
  };
}

export function setPhoneNumber(phoneNumber) {
  return {
    type: SET_PHONE_NUMBER,
    payload: { phoneNumber },
  };
}

export function setLocData(locData) {
  return {
    type: SET_LOC_DATA,
    payload: { locData },
  };
}

export function setWishUsername(wishUsername) {
  return {
    type: SET_WISH_USERNAME,
    payload: { wishUsername },
  };
}

export function cleanRegistrationData() {
  return {
    type: CLEAN_REGISTRATION_DATA,
  };
}
