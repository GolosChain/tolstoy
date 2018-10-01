import { combineReducers } from 'redux';
import common from './common';
import location from './location';
import profile from './profile';

export default combineReducers({
    common,
    location,
    profile,
});
