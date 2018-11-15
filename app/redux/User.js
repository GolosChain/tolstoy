import { fromJS } from 'immutable';
import createModule from 'redux-modules';
import cookie from 'react-cookie';

import { DEFAULT_LANGUAGE, LOCALE_COOKIE_KEY } from 'app/client_config';

const defaultState = fromJS({
    current: null,
    show_promote_post_modal: false,
    locale: DEFAULT_LANGUAGE,
    show_messages_modal: false,
});

// TODO: beautyfree - delete after new profile
if (process.env.BROWSER) {
    const locale = cookie.load(LOCALE_COOKIE_KEY);
    if (locale) defaultState.locale = locale;
}

export default createModule({
    name: 'user',
    initialState: defaultState,
    transformations: [
        {
            action: 'SHOW_LOGIN',
            reducer: (state, { payload }) =>
                state.merge({
                    loginBroadcastOperation:
                        payload && payload.operation ? fromJS(payload.operation) : null,
                }),
        },
        {
            action: 'LOGIN_CANCELED',
            reducer: state => {
                const errorCallback = state.getIn(['loginBroadcastOperation', 'errorCallback']);

                if (errorCallback) {
                    setTimeout(() => {
                        errorCallback('Canceled');
                    }, 0);
                }

                return state.merge({
                    loginBroadcastOperation: undefined,
                });
            },
        },
        {
            action: 'SAVE_LOGIN_CONFIRM',
            reducer: (state, { payload }) => state.set('saveLoginConfirm', payload),
        },
        { action: 'GET_ACCOUNT', reducer: state => state },
        {
            action: 'REMOVE_HIGH_SECURITY_KEYS',
            reducer: state => {
                if (!state.hasIn(['current', 'private_keys'])) return state;

                state = state.updateIn(['current', 'private_keys'], private_keys => {
                    if (!private_keys) return null;
                    if (private_keys.has('active_private')) console.log('removeHighSecurityKeys');
                    private_keys = private_keys.delete('active_private');
                    return private_keys;
                });

                const username = state.getIn(['current', 'username']);
                state = state.setIn(['authority', username, 'active'], 'none');
                state = state.setIn(['authority', username, 'owner'], 'none');
                return state;
            },
        },
        {
            action: 'CHANGE_CURRENCY',
            reducer: (state, { payload }) => state.set('currency', payload),
        },
        {
            action: 'CHANGE_LANGUAGE',
            reducer: (state, { payload }) => state.set('locale', payload),
        },
        {
            action: 'SET_POWERDOWN_DEFAULTS',
            reducer: (state, { payload }) => state.set('powerdown_defaults', fromJS(payload)),
        },
        {
            action: 'CLEAR_POWERDOWN_DEFAULTS',
            reducer: state => state.remove('powerdown_defaults'),
        },
        {
            action: 'SHOW_PROMOTE_POST',
            reducer: state => state.set('show_promote_post_modal', true),
        },
        {
            action: 'HIDE_PROMOTE_POST',
            reducer: state => state.set('show_promote_post_modal', false),
        },
        {
            action: 'SET_TRANSFER_DEFAULTS',
            reducer: (state, { payload }) => state.set('transfer_defaults', fromJS(payload)),
        },
        {
            action: 'CLEAR_TRANSFER_DEFAULTS',
            reducer: state => state.remove('transfer_defaults'),
        },
        {
            action: 'USERNAME_PASSWORD_LOGIN',
            reducer: state => state, // saga
        },
        {
            action: 'AUTO_LOGIN',
            reducer: state => state, // saga
        },
        {
            action: 'SET_USER',
            reducer: (state, { payload }) => {
                if (payload.vesting_shares) {
                    payload.vesting_shares = parseFloat(payload.vesting_shares);
                }

                if (payload.delegated_vesting_shares) {
                    payload.delegated_vesting_shares = parseFloat(payload.delegated_vesting_shares);
                }

                if (payload.received_vesting_shares) {
                    payload.received_vesting_shares = parseFloat(payload.received_vesting_shares);
                }

                return state.mergeDeep({
                    current: payload,
                    loginBroadcastOperation: undefined,
                });
            },
        },
        {
            action: 'HIDE_LOGIN',
            reducer: state =>
                state.merge({
                    login_error: undefined,
                    loginBroadcastOperation: undefined,
                }),
        },
        {
            action: 'LOGIN_ERROR',
            reducer: (state, { payload: { error } }) =>
                state.merge({
                    login_error: error,
                }),
        },
        {
            action: 'LOGOUT',
            reducer: () => defaultState,
        },
        // {
        //     action: 'ACCEPTED_COMMENT',
        //     // User can only post 1 comment per minute
        //     reducer: (state) => state.merge({ current: {lastComment: Date.now()} })
        // },

        {
            action: 'KEYS_ERROR',
            reducer: (state, { payload: { error } }) => state.merge({ keys_error: error }),
        },
        {
            action: 'SET_AUTHORITY',
            reducer: (state, { payload: { accountName, authority } }) =>
                state.setIn(['authority', accountName], fromJS(authority)),
        },
        {
            action: 'HIDE_CONNECTION_ERROR_MODAL',
            reducer: state => state.set('hide_connection_error_modal', true),
        },
        {
            action: 'SET',
            reducer: (state, { payload: { key, value } }) => {
                key = Array.isArray(key) ? key : [key];
                return state.setIn(key, fromJS(value));
            },
        },
        // { action: 'NOTIFICATION_CHANNEL_CREATED', reducer: state => state.set('notification_channel_created', true) },
        // { action: 'NOTIFICATION_CHANNEL_DESTROYED', reducer: state => state.set('notification_channel_created', false) },
        { action: 'SHOW_MESSAGES', reducer: state => state.set('show_messages_modal', true) },
        { action: 'HIDE_MESSAGES', reducer: state => state.set('show_messages_modal', false) },
    ],
});
