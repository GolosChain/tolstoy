import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { getSelectedContact } from 'src/messenger/redux/selectors/chat';
import { sendMessage } from 'src/messenger/redux/actions/transactions';

import DefaultChat from 'src/messenger/components/Chat/DefaultChat';
import Chat from 'src/messenger/components/Chat';

@connect(
    state => {
        return {
            selectedContact: getSelectedContact(state),
        }
    },
    {
        sendMessage,
    }
)

export default class ChatContainer extends Component {

    static propTypes = {
        selectedContact: PropTypes.instanceOf(Map),
        sendMessage: PropTypes.func.isRequired,
    }

    state = {
        message: ''
    }
    
    onContactMenuClick = () => {
        // TODO
    }
    
    onMessageInput = e => {
        const message = e.target.value;
        this.setState({ message });
    }
    
    onSendButtonClick = () => {
        const { sendMessage, selectedContact } = this.props;
        const { message } = this.state;

        sendMessage(
            selectedContact.get('contact'),
            selectedContact.get('memoKey'),
            message,
        );
    }

    render() {
        const {
            selectedContact,
        } = this.props;

        if (!selectedContact.size) {
            return <DefaultChat />
        }

        const contactInfo = {
            profileName: selectedContact.get('profileName') || selectedContact.get('contact'),
            profileImage: selectedContact.get('profileImage')
        }

        return (
            <Chat
                contactInfo={contactInfo}
                onContactMenuClick={this.onContactMenuClick}
                onMessageInput={this.onMessageInput}
                onSendButtonClick={this.onSendButtonClick}
            />
        );
    }
}
