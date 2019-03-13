import { SET_SERVER_ACCOUNT_NAME } from 'store/constants/actionTypes';

const initialState = {
  accountName: null,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_SERVER_ACCOUNT_NAME:
      return {
        accountName: payload.accountName,
      };
    default:
      return state;
  }
}
