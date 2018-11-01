import React, { Component } from 'react';

import tt from 'counterpart';
import { Helmet } from 'react-helmet';

import { authProtection } from 'src/app/helpers/hoc';
import { Messenger, ChatListPanel } from 'src/messenger/components/Messenger';
import Chat from 'src/messenger/containers/Chat';
import ChatListContainer from 'src/messenger/containers/ChatList';
import LookupAccounts from 'src/messenger/containers/LookupAccounts';

@authProtection()
export default class MessengerApp extends Component {
    componentDidMount() {
        const { authorizedAccountName, initMessenger } = this.props;

        initMessenger(authorizedAccountName);
    }

    render() {
        return (
            <Messenger>
                <Helmet title={tt('meta.title.profile.messenger')} />
                <ChatListPanel>
                    <LookupAccounts />
                    <ChatListContainer />
                </ChatListPanel>
                <Chat />
            </Messenger>
        );
    }
}
