import { combineReducers } from 'redux';

import posts from './posts';
import postComments from './postComments';
import profileComments from './profileComments';
import communities from './communities';
import users from './users';
import profiles from './profiles';
import notifications from './notifications';

export default combineReducers({
  posts,
  postComments,
  profileComments,
  communities,
  users,
  profiles,
  notifications,
});
