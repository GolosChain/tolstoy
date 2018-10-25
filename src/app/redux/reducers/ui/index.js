import { combineReducers } from 'redux';
import common from './common';
import location from './location';
import home from './home';
import profile from './profile';

export default combineReducers({
    common,
    location,
    home,
    profile,
});
