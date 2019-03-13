import { combineReducers } from 'redux';
import contacts from './contacts/contactList';
import ui from './ui';
import messages from './messages';

export default combineReducers({
  contacts,
  ui,
  messages,
});
