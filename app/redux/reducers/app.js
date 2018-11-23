import { Map, OrderedMap, fromJS } from 'immutable';
import tt from 'counterpart';

const defaultState = fromJS({
    requests: {},
    loading: false,
    error: '',
    location: {
        current: null,
        previous: null,
    },
    notifications: null,
    ignoredLoadingRequestCount: 0,
});

export default function reducer(state = defaultState, { type, payload, error }) {
    if (type === '@@router/LOCATION_CHANGE') {
        return state.updateIn(['location'], Map(), c =>
            c.set('previous', c.get('current')).set('current', fromJS(payload))
        );
    }

    if (type === 'CHAIN_API_ERROR') {
        //return state.set('error', error).set('loading', false);
        return state.set('error', error);
    }

    if (type === 'FETCH_DATA_BEGIN') {
        return state.set('loading', true);
    }
    if (type === 'FETCH_DATA_END') {
        return state.set('loading', false);
    }

    let res = state;
    if (type === 'ADD_NOTIFICATION') {
        const n = {
            action: tt('g.dismiss'),
            dismissAfter: 10000,
            ...payload,
        };
        res = res.update('notifications', s => {
            return s ? s.set(n.key, n) : OrderedMap({ [n.key]: n });
        });
    }
    if (type === 'REMOVE_NOTIFICATION') {
        res = res.update('notifications', s => s.delete(payload.key));
    }
    return res;
}
