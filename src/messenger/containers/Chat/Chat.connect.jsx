import { connect } from 'react-redux';

import ChatContainer from './Chat';

import { getCurrentUserProfileImage } from 'src/messenger/redux/selectors/common';
import { getSelectedContact } from 'src/messenger/redux/selectors/chat';
import { getThreadMessages } from 'src/messenger/redux/selectors/messages';
import { sendMessage } from 'src/messenger/redux/actions/transactions';

export default connect(
  state => ({
    selectedContact: getSelectedContact(state),
    messages: getThreadMessages(state),
    currentUserProfileImage: getCurrentUserProfileImage(state),
  }),
  {
    sendMessage,
  }
)(ChatContainer);
