import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';

import Icon from 'golos-ui/Icon';
import Avatar from 'src/app/components/common/Avatar';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;

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

    margin-right: 10px;
    padding: 7px 13px;

    font-size: 14px;
    color: #fff;
    border-radius: 8px;
    background-color: #2879ff;
    overflow: hidden;
`;

const Meta = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: baseline;

    margin-right: 10px;
`;

const Time = styled.div`
    margin-right: 5px;
    font-size: 10px;
    color: #959595;
`;

const Status = styled.div`
    display: flex;
`;

const RejectedMessage = styled.div`
    color: #959595;
    font-size: 10px;
    text-align: right;
    opacity: 0.9;
`;

const propTypes = {
    contactImage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    messageText: PropTypes.string,
    date: PropTypes.string,
    metadata: PropTypes.instanceOf(Map),
};

const MessageOut = ({ contactImage, messageText, date, metadata }) => {
    const status = metadata.get('status');
    
    return (
        <Wrapper>
            <Body>
                <Text>{messageText}</Text>
                <Meta>
                    <Time>{date}</Time>
                    <Status>
                        {status === 'sent' && <Icon name="ic-sent" width="9" height="8" />}
                        {status === 'viewed' && <Icon name="ic-viewed" width="15" height="8" />}
                    </Status>
                </Meta>
            </Body>
            <Avatar avatarUrl={contactImage} size={35} />
        </Wrapper>
    );
};

MessageOut.propTypes = propTypes;

export default MessageOut;
