import { SAVE_GENERAL_SETTINGS } from 'store/constants';

const initialState = {
  locale: 'en',
  nsfw: 'warn',
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SAVE_GENERAL_SETTINGS:
      return {
        ...state,
        [payload.data.name]: payload.data.value,
      };
    default:
      return state;
  }
}
