import { path, mergeRight } from 'ramda';

const initialState = {};

export default function(state = initialState, { payload }) {
  const entities = path(['entities', 'communities'], payload);

  if (entities) {
    return mergeRight(state, entities);
  }

  return state;
}
