import { combineReducers } from 'redux';
import search from './contacts/search';
import contacts from './contacts/contactList';

export default combineReducers({
    search,
    contacts
});
