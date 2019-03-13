import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Avatar from 'src/app/components/common/Avatar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;

  padding: 2px;
  overflow: hidden;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;

  max-width: 320px;
  overflow: hidden;
`;

const Text = styled.div`
  flex: 1;

  margin-left: 10px;
  padding: 7px 13px;

  font-size: 14px;
  color: #333;
  border-radius: 8px;
  background-color: #f8f8f8;
  overflow: hidden;
`;

const Time = styled.div`
  margin-left: 22px;
  font-size: 10px;
  color: #959595;
  text-align: left;
`;

const propTypes = {
  contactImage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  messageText: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

const MessageIn = ({ contactImage, messageText, date }) => (
  <Wrapper>
    <Body>
      <Text>{messageText}</Text>
      <Time>{date}</Time>
    </Body>
    <Avatar avatarUrl={contactImage} size={35} />
  </Wrapper>
);

MessageIn.propTypes = propTypes;

export default MessageIn;
