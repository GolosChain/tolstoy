import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Avatar from 'src/app/components/common/Avatar';
import Icon from 'golos-ui/Icon';

import MessageBubble from 'src/messenger/components/Chat/MessageBubble';
import SendMessagePanel from 'src/messenger/components/Chat/SendMessagePanel';

const Wrapper = styled.div`
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

const ContactInfo = styled.div`
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
    flex: 1;
    flex-direction: column;

    padding: 15px;
`;

const Footer = styled.div`
`;

const Message = styled.div`
    display: flex;
    justify-content: ${({ self }) => (self ? 'flex-end' : 'flex-start')};
`;

export default class Chat extends Component {

    static propTypes = {
        contactInfo: PropTypes.shape({
            profileName: PropTypes.string,
            profileImage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        }).isRequired,
        // messages: PropTypes.instanceOf(Map),
        onContactMenuClick: PropTypes.func.isRequired,
        onMessageInput: PropTypes.func.isRequired,
        onSendButtonClick: PropTypes.func.isRequired,
    }

    renderMessages = messages => {
        // TODO 
        return messages.map(message => (
                <Message
                    key={message.time}
                    self={message.sender === 'self'}
                >
                    <MessageBubble {...message}/>
                </Message>
            )
        );
    }

    render() {
        const {
            contactInfo: { profileName, profileImage },
            onContactMenuClick,
            onMessageInput,
            onSendButtonClick,
        } = this.props;
   
        return (
            <Wrapper>
                <Header>
                    <ContactInfo>
                        <Avatar avatarUrl={profileImage} size={35} />
                        <Name>{profileName}</Name>
                    </ContactInfo>
                    <DotsWrapper onClick={onContactMenuClick}>
                        <Dots name="dots" />
                    </DotsWrapper>
                </Header>
                <Body>
                    {/* {this.renderMessages(messages)} */}
                </Body>
                <Footer>
                    <SendMessagePanel
                        onMessageInput={onMessageInput}
                        onSendButtonClick={onSendButtonClick}
                    />
                </Footer>
            </Wrapper>
        );
    }
}
