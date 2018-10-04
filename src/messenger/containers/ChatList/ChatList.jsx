import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { showResults, getAccounts } from '../../redux/selectors/common';
import { getContactList } from '../../redux/selectors/contacts';

import ChatList from '../../components/ChatList';
import ChatListItem from '../../components/ChatList/ChatListItem';

@connect(state => {
    return {
        searchAccounts: getAccounts(state),
        showSearchResults: showResults(state),
        contactList: getContactList(state),
    };
})

export default class ChatListContainer extends Component {
    static propTypes = {
        contactList: PropTypes.instanceOf(Map),
        searchAccounts: PropTypes.instanceOf(Map),
        showSearchResults: PropTypes.bool
    };

    renderChatList = list => {
        return list
            .map(item => (
                <ChatListItem
                    key={item.get('contact')}
                    userName={item.get('contact')}
                    profileImage={item.get('profileImage')}
                    profileName={item.get('profileName')}
                    time={item.get('time')}
                    lastMessage={
                        item.get('lastMessage') ? item.get('lastMessage') : `@${item.get('contact')}`
                    }
                    unread={item.get('unread')}
                />
            ))
            .toArray();
    };

    render() {
        const {
            searchAccounts,
            showSearchResults,
            contactList
        } = this.props;
        
        return (
            <ChatList>{this.renderChatList(showSearchResults ? searchAccounts : contactList)}</ChatList>
        );
    }
}
