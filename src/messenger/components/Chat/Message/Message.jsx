import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';

import { fortmatTime } from 'src/messenger/utils/formatters';

import MessageIn from './MessageIn';
import MessageOut from './MessageOut';

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
`;

const propTypes = {
  contactImage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  messageText: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  metadata: PropTypes.instanceOf(Map),
};

const Message = ({ contactImage, messageText, date, type, metadata }) => (
  <Wrapper>
    {type === 'messageIn' ? (
      <MessageIn contactImage={contactImage} messageText={messageText} date={fortmatTime(date)} />
    ) : (
      <MessageOut
        contactImage={contactImage}
        messageText={messageText}
        date={fortmatTime(date)}
        metadata={metadata}
      />
    )}
  </Wrapper>
);

Message.propTypes = propTypes;

export default Message;
