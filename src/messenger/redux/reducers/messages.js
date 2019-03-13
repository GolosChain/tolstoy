import { fromJS, Map } from 'immutable';

import { MESSAGES_GET_THREAD_SUCCESS } from 'src/messenger/redux/constants/messages';

const initialState = Map({
  threads: Map(),
});

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case MESSAGES_GET_THREAD_SUCCESS:
      return state.setIn(['threads', payload.selectedContact], fromJS(payload.messages));
    default:
      return state;
  }
}
