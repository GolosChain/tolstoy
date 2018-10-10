import { connect } from 'react-redux';

import { ChatListContainer } from 'src/messenger/containers/ChatList/ChatList'

import {
    getSearchContacts,
    getContactList,
} from 'src/messenger/redux/selectors/contacts';
import {
    getSelectedChat,
    showSearchResults,
} from 'src/messenger/redux/selectors/ui';
import { selectChat } from 'src/messenger/redux/actions/ui';

export default connect(
    state => ({
        searchContacts: getSearchContacts(state),
        showSearchResults: showSearchResults(state),
        contactList: getContactList(state),
        selectedChat: getSelectedChat(state),
    }),
    {
        selectChat
    }
)(ChatListContainer);
