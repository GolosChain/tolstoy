import { path } from 'ramda';

export function entitiesReducer(entitiesName, reducer) {
  return (state, action) => {
    const entities = path(['payload', 'entities', entitiesName], action);

    let newState;

    if (entities) {
      if (state) {
        newState = state.merge(entities);
      } else {
        newState = entities;
      }
    } else {
      newState = state;
    }

    return reducer(newState, action);
  };
}

export function combineEntitiesReducers(reducers) {
  const wrappedReducers = [];

  for (let fieldName of Object.keys(reducers)) {
    wrappedReducers.push({
      fieldName,
      reducer: entitiesReducer(fieldName, reducers[fieldName]),
    });
  }

  return (state = {}, action) => {
    const newState = {};

    let someUpdated = false;

    for (let { fieldName, reducer } of wrappedReducers) {
      const prevSubState = state[fieldName];
      const newSubState = reducer(prevSubState, action);

      newState[fieldName] = newSubState;

      if (prevSubState !== newSubState) {
        someUpdated = true;
      }
    }

    if (someUpdated) {
      return newState;
    } else {
      return state;
    }
  };
}
