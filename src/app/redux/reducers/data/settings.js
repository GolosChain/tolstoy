import { fromJS } from 'immutable';
import { pick, mergeDeepRight } from 'ramda';
import {
    SETTING_GET_OPTIONS_SUCCESS,
    SETTING_SET_OPTIONS,
    SETTING_SET_OPTIONS_SUCCESS,
    SETTING_SET_OPTIONS_FOR_UNATHORIZED,
} from 'src/app/redux/constants/settings';
import { USER_LOGOUT } from 'src/app/redux/constants/auth';
import { DEFAULT_LANGUAGE, DEFAULT_CURRENCY } from 'app/client_config';

const defaults = {
    basic: {
        rounding: 2,
        selfVote: false,
        nsfw: 'warn',
        lang: DEFAULT_LANGUAGE,
        currency: DEFAULT_CURRENCY,
        award: 0,
        selectedTags: {},
    },
};

const initialState = fromJS(defaults);

const setSettingsOptionsFromMeta = (state, meta) => {
    return state.withMutations(state => {
        const data = pick(['notify', 'push', 'basic', 'mail'], meta);
        for (let key in data) {
            state.mergeIn([key], fromJS(data[key]));
        }

        return state;
    });
};

export default function(state = initialState, { type, payload, error, meta }) {
    switch (type) {
        case SETTING_GET_OPTIONS_SUCCESS:
            return fromJS(mergeDeepRight(defaults, payload));

        case SETTING_SET_OPTIONS:
            return setSettingsOptionsFromMeta(state, meta);

        case SETTING_SET_OPTIONS_SUCCESS:
            return setSettingsOptionsFromMeta(state, meta);

        // Save settings in store for unathorized user
        case SETTING_SET_OPTIONS_FOR_UNATHORIZED:
            return setSettingsOptionsFromMeta(state, meta);

        case USER_LOGOUT:
            return initialState.setIn(
                ['basic', 'lang'],
                state.getIn(['basic', 'lang'], DEFAULT_LANGUAGE)
            );
    }

    return state;
}
