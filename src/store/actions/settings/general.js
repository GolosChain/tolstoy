/* eslint-disable import/prefer-default-export */
import { SAVE_GENERAL_SETTINGS } from 'store/constants';

export const saveSettings = data => ({
  type: SAVE_GENERAL_SETTINGS,
  payload: {
    data,
  },
});
