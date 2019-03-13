import { UPDATE_UI_MODE } from 'store/constants/actionTypes';

const initialState = {
  screenType: 'mobile',
  isOneColumnMode: true,
  isDragAndDrop: false,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_UI_MODE:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
