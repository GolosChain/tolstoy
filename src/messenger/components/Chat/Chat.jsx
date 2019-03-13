import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';

import Avatar from 'src/app/components/common/Avatar';
import Icon from 'golos-ui/Icon';

import SendMessagePanel from './SendMessagePanel';

import Message from './Message';

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
  flex-direction: column-reverse;
`;

const ScrollPanel = styled.div`
  padding: 15px;
  overflow-y: auto;
`;

const Footer = styled.div``;

export default class Chat extends Component {
  static propTypes = {
    contactInfo: PropTypes.shape({
      profileName: PropTypes.string,
      profileImage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    }).isRequired,
    messages: PropTypes.instanceOf(List),
    onContactMenuClick: PropTypes.func.isRequired,
    onMessageInput: PropTypes.func.isRequired,
    onSendButtonClick: PropTypes.func.isRequired,
    currentUserProfileImage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  };

  renderMessages = messages => {
    const { contactInfo, currentUserProfileImage } = this.props;

    return messages.map(message => {
      const type = message.get('type');
      const contactImage =
        type === 'messageIn' ? contactInfo.profileImage : currentUserProfileImage;

      return (
        <Message
          key={message.get('nonce')}
          contactImage={contactImage}
          messageText={message.get('message')}
          date={message.get('create_date')}
          type={type}
          metadata={message.get('metadata')}
        />
      );
    });
  };

  render() {
    const {
      contactInfo: { profileName, profileImage },
      messages,
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
          <ScrollPanel>{this.renderMessages(messages)}</ScrollPanel>
        </Body>
        <Footer>
          <SendMessagePanel onMessageInput={onMessageInput} onSendButtonClick={onSendButtonClick} />
        </Footer>
      </Wrapper>
    );
  }
}
