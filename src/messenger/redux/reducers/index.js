import { combineReducers } from 'redux';
import contacts from './contacts/contactList';
import ui from './ui';

export default combineReducers({
    contacts,
    ui,
});
