import { UPDATE_UI_MODE } from 'store/constants/actionTypes';

export const updateUIMode = payload => ({
  type: UPDATE_UI_MODE,
  payload,
});

// Set store's variables in 'ui.mode' by analyzing useragent header.
// (Uses only for SSR)
export function setScreenTypeByUserAgent(useragent) {
  if (/ipad/i.test(useragent)) {
    return updateUIMode({ screenType: 'tablet' });
  }

  if (!/iphone|android/i.test(useragent)) {
    return updateUIMode({ screenType: 'desktop', isOneColumnMode: false });
  }

  return null;
}
