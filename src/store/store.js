import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { modalsMiddleware } from 'redux-modals-manager';

import { apiCommunMiddleware, apiGateMiddleware } from 'store/middlewares';
import rootReducer from 'store/reducers';

export default (state = {}) => {
  const middlewares = [thunkMiddleware, apiCommunMiddleware, apiGateMiddleware, modalsMiddleware];

  if (process.env.NODE_ENV !== 'production' && (process.env.REDUX_LOGGER || process.browser)) {
    // eslint-disable-next-line
    const { createLogger } = require('redux-logger');
    middlewares.push(createLogger());
  }

  const store = createStore(
    rootReducer,
    state,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV === 'development' && process.browser) {
    // eslint-disable-next-line no-underscore-dangle
    window.__store = store;
  }

  return store;
};
