import { GATE_SEND_MESSAGE } from 'src/app/redux/constants/gate';
import {
    SETTING_GET_OPTIONS,
    SETTING_GET_OPTIONS_SUCCESS,
    SETTING_GET_OPTIONS_ERROR,
    SETTING_SET_OPTIONS,
    SETTING_SET_OPTIONS_SUCCESS,
    SETTING_SET_OPTIONS_ERROR,
    SETTING_SET_OPTIONS_FOR_UNATHORIZED,
} from 'src/app/redux/constants/settings';
import { userSelector, dataSelector } from 'src/app/redux/selectors/common';

export function getSettingsOptions({ profile = 'web' } = {}) {
    return {
        type: GATE_SEND_MESSAGE,
        payload: {
            method: 'getOptions',
            types: [SETTING_GET_OPTIONS, SETTING_GET_OPTIONS_SUCCESS, SETTING_GET_OPTIONS_ERROR],
            data: { profile },
        },
        meta: { profile },
    };
}

export function setSettingsOptions({ profile = 'web', successCallback, ...values } = {}) {
    return (dispatch, getState) => {
        const currentUser = userSelector('current')(getState());
        const settings = dataSelector('settings')(getState());
        const data = { ...settings.toJS(), ...values };

        if (currentUser) {
            dispatch({
                type: GATE_SEND_MESSAGE,
                payload: {
                    method: 'setOptions',
                    types: [
                        SETTING_SET_OPTIONS,
                        SETTING_SET_OPTIONS_SUCCESS,
                        SETTING_SET_OPTIONS_ERROR,
                    ],
                    data: { profile, ...data },
                    successCallback,
                },
                meta: { profile, ...values },
            });
        } else {
            dispatch({
                type: SETTING_SET_OPTIONS_FOR_UNATHORIZED,
                payload: { profile, ...data },
                meta: { profile, ...values },
            });
            if (successCallback) {
                successCallback();
            }
        }
    };
}

export function setSettingsLocale(locale) {
    return setSettingsOptions({
        basic: {
            lang: locale,
        },
    });
}
