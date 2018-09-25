import React, { Component } from 'react';
import styled from 'styled-components';

import Avatar from 'src/app/components/common/Avatar';
import Icon from 'golos-ui/Icon';

import MessageBubble from './MessageBubble';

const ChatWrapper= styled.div`
    display: flex;
    flex: 1 1 60%;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    align-items: center;

    padding: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Sender = styled.div`
    display: flex;
    flex: 1;
    align-items: center;

    margin-left: 20px;
`;

const Name = styled.div`
    margin-left: 15px;

    font-size: 14px;
    font-weight: bold;
    color: #393636;
`;

const DotsWrapper = styled.div`
    margin-left: 15px;
    cursor: pointer;
`;

const Dots = styled(Icon)`
    display: block;
    width: 20px;
    height: 20px;
    color: #393636;
    user-select: none;
`;

const Body = styled.div`
    display: flex;
    flex-direction: column;

    padding: 15px;
`;

const Message = styled.div`
    display: flex;
    justify-content: ${({self}) => self ? 'flex-end' : 'flex-start'};
`;

export default class Chat extends Component {

    _renderMessages = (messages) => {
        return messages.map(message => {
            return (
                <Message
                    key={message.time}
                    self={message.sender === 'self'}
                >
                    <MessageBubble {...message}/>
                </Message>
            );
        })
    }

    _onMenuClick = () => {

    }

    render() {
        const {
            senderProfileImage,
            senderName,
            messages
        } = this.props;
        return (
            <ChatWrapper>
                <Header>
                    <Sender>
                        <Avatar
                            avatarUrl={senderProfileImage}
                            size={35}
                        />
                        <Name>
                            {senderName}
                        </Name>
                    </Sender>
                    <DotsWrapper onClick={this._onMenuClick}>
                        <Dots name="dots" />
                    </DotsWrapper>
                </Header>
                <Body>
                    {this._renderMessages(messages)}
                </Body>
            </ChatWrapper>
        );
    }
}
