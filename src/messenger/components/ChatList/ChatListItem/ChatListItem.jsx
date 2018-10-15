import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Avatar from 'src/app/components/common/Avatar';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    
    padding: 18px;

    background-color: ${({ selected }) => (selected ? '#aecaff' : '#fff')};
    border-bottom: 1px solid #fff;
    cursor: pointer;
    user-select: none;
`;

const Name = styled.div`
    font-size: 14px;
    font-weight: bold;
    color: #393636;
`;

const MessagePreview = styled.div`
    font-size: 16px;
    color: #757575;
`;

const Time = styled.div`
    font-size: 12px;
    color: #959595;
`;

const Body = styled.div`
    flex: 1;
    flex-direction: column;

    margin-left: 10px;
`;

const Sender = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default class ChatListItem extends Component {
    static propTypes = {
        profileName: PropTypes.string,
        profileImage: PropTypes.string,
        selected: PropTypes.bool,
        time: PropTypes.string,
        lastMessage: PropTypes.string,
        unread: PropTypes.bool,
        onSelect: PropTypes.func.isRequired,
    };

    render() {
        const {
            profileName,
            profileImage,
            selected,
            unread,
            time,
            lastMessage,
            onSelect,
        } = this.props;

        return (
            <Wrapper 
                unread={unread}
                selected={selected}
                onClick={onSelect}
            >
                <Avatar
                    avatarUrl={profileImage}
                    size={40}
                />
                <Body>
                    <Sender>
                        <Name>{profileName}</Name>
                        <Time>{time}</Time>
                    </Sender>
                    <MessagePreview>
                        {lastMessage}
                    </MessagePreview>
                </Body>
            </Wrapper>
        );
    }
}
