import React, { Fragment } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import Icon from 'golos-ui/Icon';

const ReplyCounterBlock = styled(Link)`
    height: 100%;
    min-height: 50px;
    padding: 0 11px 0 18px;
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: flex-end;
    cursor: pointer;
`;

const ReplyCount = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #959595;
    user-select: none;
`;

const Splitter = styled.div`
    width: 1px;
    height: 26px;
    background: #e1e1e1;
`;

const ReplyLink = styled.div`
    height: 100%;
    min-height: 50px;
    padding: 0 18px 0 10px;
    display: flex;
    align-items: center;
    flex-grow: 1;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #393636 !important;
    cursor: pointer;
`;

const ReplyIcon = styled(Icon)`
    width: 20px;
    height: 20px;
    margin-right: 7px;
    margin-bottom: -2px;
    color: #393636;
`;

const Root = styled.div`
    display: flex;
    align-items: center;

    ${is('grid')`
        width: 100%;
        height: 56px;
        justify-content: center;
        border-top: 1px solid #e9e9e9;
        
        @media (max-width: 700px) {
            height: 50px;
        }
    `};
`;

ReplyBlock.defaultProps = {
    showReply: true,
};

export default function ReplyBlock({ grid, count, link, text, onReplyClick, showReply, className }) {
    return (
        <Root grid={grid} className={className}>
            <ReplyCounterBlock
                to={`${link}#comments`}
                data-tooltip={tt('reply.comments_count')}
                aria-label={tt('reply.comments_count')}
            >
                <ReplyIcon name="reply" />
                <ReplyCount>{count}</ReplyCount>
            </ReplyCounterBlock>
            {showReply && (
                <Fragment>
                    <Splitter />
                    <ReplyLink onClick={onReplyClick}>{text}</ReplyLink>
                </Fragment>
            )}
        </Root>
    );
}
