import { combineReducers } from 'redux';
import gate from './gate';
import notifications from './notifications';
import settings from './settings';
import followers from './followers';
import comments from './comments';

export default combineReducers({
    gate,
    notifications,
    settings,
    followers,
    comments,
});
