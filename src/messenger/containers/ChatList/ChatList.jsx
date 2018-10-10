import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Map } from 'immutable';

import ChatList from 'src/messenger/components/ChatList';
import ChatListItem from 'src/messenger/components/ChatList/ChatListItem';


export class ChatListContainer extends Component {
    
    static propTypes = {
        showSearchResults: PropTypes.bool,
        searchContacts: PropTypes.instanceOf(Map),
        contactList: PropTypes.instanceOf(Map),
        selectedChat: PropTypes.instanceOf(Map),
        selectChat: PropTypes.func.isRequired,
    };

    onSelectChat = (contact, type) => {
        this.props.selectChat(contact, type)
    };

    renderChatList = (list, listType) => {
        const { selectedChat } = this.props;
        
        return list
            .map(item => (
                <ChatListItem
                    key={item.get('contact')}
                    profileName={item.get('profileName')}
                    profileImage={item.get('profileImage')}
                    selected={selectedChat.get('contact') === item.get('contact')}
                    time={item.get('time')}
                    lastMessage={
                        item.get('lastMessage') ? item.get('lastMessage') : `@${item.get('contact')}`
                    }
                    unread={item.get('unread')}
                    onSelect={
                        () => this.onSelectChat(item.get('contact'), listType)
                    }
                />
            ))
            .toArray();
    };

    render() {
        const {
            showSearchResults,
            searchContacts,
            contactList
        } = this.props;

        const listType = searchContacts.size ? 'search' : 'contacts';

        return (
            <ChatList>
                {this.renderChatList(showSearchResults ? searchContacts : contactList, listType)}
            </ChatList>
        );
    }
}
