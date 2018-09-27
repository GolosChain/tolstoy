import React, { Component } from 'react';
import tt from 'counterpart';
import { Helmet } from 'react-helmet';

import { authProtection } from 'src/app/helpers/hoc';
import { Messenger, ChatListPanel }  from '../../components/Messenger';
import Chat  from '../Chat';
import ChatListContainer from '../ChatList';
import LookupAccounts from '../LookupAccounts';
import { dialogs, chatData } from '../../utils/_data';

@authProtection()
export default class MessengerApp extends Component {
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
                    <ChatListContainer 
                        dialogs={dialogs}
                    />
                </ChatListPanel>
                <Chat data={chatData}/>
            </Messenger>
        );
    }
}
