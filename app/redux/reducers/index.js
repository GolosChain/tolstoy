import { Map, fromJS } from 'immutable';
import { combineReducers, __DO_NOT_USE__ActionTypes as ActionTypes } from 'redux';
import { routerReducer } from 'react-router-redux/lib';

import { contentStats } from 'app/utils/StateFunctions';

import app from './app';
import globalReducerModule from './../GlobalReducer';
import marketReducerModule from './../MarketReducer';
import user from './../User';
import transaction from './../Transaction';
import offchain from './offchain';
import { reducer as formReducer } from 'redux-form'; // @deprecated, instead use: app/utils/ReactForm.js
import status from 'src/app/redux/reducers/status';
import entities from 'src/app/redux/reducers/entities';
import ui from 'src/app/redux/reducers/ui';
import data from 'src/app/redux/reducers/data';
import messenger from 'src/messenger/redux/reducers';

export function initReducer(reducer, type) {
    return (state, action) => {
        if (!state) return reducer(state, action);

        // @@redux/INIT server and client init
        if (action.type === ActionTypes.INIT || action.type === '@@INIT') {
            if (!(state instanceof Map)) {
                state = fromJS(state);
            }
            if (type === 'global') {
                const content = state.get('content').withMutations(c => {
                    c.forEach((cc, key) => {
                        if (!c.getIn([key, 'stats'])) {
                            c.setIn([key, 'stats'], fromJS(contentStats(cc)));
                        }
                    });
                });
                state = state.set('content', content);
            }
            return state;
        }

        if (action.type === '@@router/LOCATION_CHANGE' && type === 'global') {
            state = state.set('pathname', action.payload.pathname);
            // console.log(action.type, type, action, state.toJS())
        }

        return reducer(state, action);
    };
}

export default combineReducers({
    global: initReducer(globalReducerModule.reducer, 'global'),
    market: initReducer(marketReducerModule.reducer),
    offchain: initReducer(offchain),
    user: initReducer(user.reducer),
    transaction: initReducer(transaction.reducer),
    discussion: initReducer((state = {}) => state),
    routing: initReducer(routerReducer),
    app: initReducer(app),
    form: formReducer,

    status: initReducer(status),
    entities: initReducer(entities),
    ui: initReducer(ui),
    data,

    messenger: initReducer(messenger),
});
