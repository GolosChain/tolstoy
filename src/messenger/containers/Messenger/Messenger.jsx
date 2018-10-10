import React, { Component } from 'react';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { Helmet } from 'react-helmet';

import { authProtection } from 'src/app/helpers/hoc';
import { Messenger, ChatListPanel } from '../../components/Messenger';
import Chat from '../Chat';
import ChatListContainer from '../ChatList';
import LookupAccounts from '../LookupAccounts';
import { initMessenger } from '../../redux/actions/messenger';

@authProtection()
@connect(
    null,
    {
        initMessenger,
    }
)
export default class MessengerApp extends Component {

    componentDidMount() {
        const {
            authorizedAccountName,
            initMessenger
        } = this.props;
        
        initMessenger(authorizedAccountName);
    }

    render() {
        return (
            <Messenger>
                <Helmet>
                    <title>
                        {tt('meta.title.profile.messenger')}
                    </title>
                </Helmet>
                <ChatListPanel>
                    <LookupAccounts />
                    <ChatListContainer />
                </ChatListPanel>
                <Chat />
            </Messenger>
        );
    }
}
