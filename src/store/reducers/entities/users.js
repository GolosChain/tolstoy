import { path, map, omit } from 'ramda';

const initialState = {};

export default function(state = initialState, { payload }) {
  const entities = path(['entities', 'users'], payload);

  if (entities) {
    return {
      ...state,
      ...map(
        user =>
          // Rename field 'userId' -> 'id'
          omit(['userId'], {
            ...user,
            id: user.userId,
          }),
        entities
      ),
    };
  }

  return state;
}
