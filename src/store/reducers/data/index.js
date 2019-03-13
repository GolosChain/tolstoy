import { combineReducers } from 'redux';

import auth from './auth';
import serverAuth from './serverAuth';
import settings from './settings';
import registration from './registration';
import notifications from './notifications';

export default combineReducers({
  auth,
  registration,
  serverAuth,
  settings,
  notifications,
});
