import { combineReducers } from 'redux';

import comments from './comments';
import mode from './mode';

export default combineReducers({
  comments,
  mode,
});
