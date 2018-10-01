import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    showResults,
    getAccounts
} from '../../redux/selectors/common';

import ChatList from '../../components/ChatList';
import ChatListItem from '../../components/ChatList/ChatListItem';

@connect(
    state => {
        return {
            searchAccounts: getAccounts(state),
            showSearchResults: showResults(state)
        }
    },
)

export default class ChatListContainer extends Component {
    render() {
        const {
            dialogs,
            searchAccounts,
            showSearchResults
        } = this.props;

        return (
            <ChatList>
                {this._renderChatList(
                    showSearchResults
                        ? searchAccounts
                        : dialogs
                )}
            </ChatList>
        );
    }

    _renderChatList = list => {
        return list.map(item => (
             <ChatListItem
                key={item.name}
                userName={item.name}
                profileImage={item.profileImage}
                profileName={item.profileName}
                time={item.time}
                lastMessage={item.lastMessage
                    ? item.lastMessage
                    : `@${item.name}`
                }
                unread={item.unread}
            />
        ));
    };
}
