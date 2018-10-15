import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex: 1 1 60%;
    align-items: center;
    justify-content: center;
`;

const DefaultChat = () => (
    <Wrapper>
        {/* TODO */}
        <p>Please select a chat to start messaging</p>
    </Wrapper>
);

export default DefaultChat;
