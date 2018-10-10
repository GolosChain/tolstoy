import { combineReducers } from 'redux';
import contacts from 'src/messenger/redux/reducers/contacts/contactList';
import ui from 'src/messenger/redux/reducers/ui';

export default combineReducers({
    contacts,
    ui,
});
