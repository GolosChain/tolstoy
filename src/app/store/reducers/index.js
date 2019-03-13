import { combineReducers } from 'redux';

import { modalsReducer as modals } from 'redux-modals-manager';
import data from './data';
import entities from './entities';
import status from './status';
import ui from './ui';

export default combineReducers({
  data,
  entities,
  status,
  ui,
  modals,
});
