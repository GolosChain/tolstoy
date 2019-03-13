/* eslint-disable global-require */

import { normalize } from 'normalizr';
import { currentUsernameUnsafeSelector } from 'store/selectors/auth';

export const CALL_GATE = 'CALL_GATE';

let client = null;

if (process.browser) {
  const GateWsClient = require('./clients/GateWsClient').default;
  client = new GateWsClient();
} else {
  const FacadeClient = require('./clients/FacadeClient').default;
  client = new FacadeClient();
}

export default ({ getState }) => next => async action => {
  if (!action[CALL_GATE]) {
    return next(action);
  }

  const gateCall = action[CALL_GATE];

  const actionWithoutCall = { ...action };
  delete actionWithoutCall[CALL_GATE];

  const { types, method, params, schema } = gateCall;
  const [requestType, successType, failureType] = types;

  next({
    ...actionWithoutCall,
    type: requestType,
    payload: null,
    error: null,
  });

  try {
    let username;

    if (!process.browser) {
      username = currentUsernameUnsafeSelector(getState());
    }

    let result = await client.callApi(method, params, username);

    if (schema) {
      try {
        result = normalize(result, schema);
      } catch (err) {
        err.message = `Normalization failed: ${err.message}`;
        throw err;
      }
    }

    next({
      ...actionWithoutCall,
      type: successType,
      payload: result,
      error: null,
    });

    return result;
  } catch (err) {
    next({
      ...actionWithoutCall,
      type: failureType,
      payload: null,
      error: err,
    });

    throw err;
  }
};
