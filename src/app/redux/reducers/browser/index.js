import { BROWSER_RESIZE } from '../../constants/browser';

const initialState = process.env.BROWSER
    ? {
          width: window.innerWidth,
          height: window.innerHeight,
      }
    : {
          width: 1280,
          height: 700,
      };

export default function(state = initialState, { type, payload }) {
    if (type === BROWSER_RESIZE) {
        return {
            ...state,
            width: payload.width,
            height: payload.height,
        };
    }

    return state;
}
