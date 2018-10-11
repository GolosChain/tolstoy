import { connect } from 'react-redux';

import { ChatContainer } from './Chat';

import { getSelectedContact } from 'src/messenger/redux/selectors/chat';
import { sendMessage } from 'src/messenger/redux/actions/transactions';

export default connect(
    state => ({
        selectedContact: getSelectedContact(state),
    }),
    {
        sendMessage,
    }
)(ChatContainer);
