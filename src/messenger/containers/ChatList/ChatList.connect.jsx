import { connect } from 'react-redux';

import ChatListContainer from './ChatList';

import { getSearchContacts, getContactList } from 'src/messenger/redux/selectors/contacts';
import { getSelectedChat, showSearchResults } from 'src/messenger/redux/selectors/ui';
import { selectChat } from 'src/messenger/redux/actions/ui';
import { getThread } from 'src/messenger/redux/actions/messages';

export default connect(
  state => ({
    searchContacts: getSearchContacts(state),
    showSearchResults: showSearchResults(state),
    contactList: getContactList(state),
    selectedChat: getSelectedChat(state),
  }),
  {
    selectChat,
    getThread,
  }
)(ChatListContainer);
