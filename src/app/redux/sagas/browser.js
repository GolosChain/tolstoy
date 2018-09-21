import throttle from 'lodash/throttle';
import { dispatch } from 'app/clientRender';
import { BROWSER_RESIZE } from '../constants/browser';

export default function* watch() {
    if (process.env.BROWSER) {
        window.addEventListener(
            'resize',
            throttle(() => {
                dispatch({
                    type: BROWSER_RESIZE,
                    payload: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    },
                });
            }, 100)
        );
    }
}
