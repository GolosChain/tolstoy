import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'src/app/components/golos-ui/Icon';

import VotePanel from 'src/app/components/common/VotePanel';
import ReplyBlock from 'src/app/components/common/ReplyBlock';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    pointer-events: none;

    & > * {
        pointer-events: initial;
    }

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        flex-direction: column;
    }
`;

const CommentVotePanel = styled(VotePanel)`
    width: 257px;

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        width: 100%;
        justify-content: space-between;
    }
`;

const CommentReplyBlock = styled(ReplyBlock)`
    margin: 0;

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        justify-content: center;
    }
`;

const CommentRightButtons = styled.div`
    display: flex;
    align-items: center;

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        width: 100%;
        justify-content: center;
        border-top: 2px solid #e9e9e9;
    }
`;

const Splitter = styled.div`
    flex-shrink: 0;
    width: 1px;
    height: 26px;
    margin: 0 6px;
    background: #e1e1e1;
`;

const DonateSplitter = styled(Splitter)`
    margin: 0;
`;

const FooterConfirm = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
`;

const ButtonConfirm = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    color: #b7b7ba;
    cursor: pointer;

    ${is('main')`
        color: #2879ff !important;
    `};

    &:hover {
        color: #393636;
    }

    &:last-child {
        padding-right: 18px;
    }
`;

const DonateButton = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    min-height: 50px;
    padding: 0 10px;

    cursor: pointer;

    @media (min-width: 890px) and (max-width: 1087px), (max-width: 639px) {
        margin-left: 0;
    }
`;

export default class CommentFooter extends Component {
    static propTypes = {
        commentRef: PropTypes.object,
        contentLink: PropTypes.string,
        comment: PropTypes.instanceOf(Map),
        edit: PropTypes.bool.isRequired,
        isOwner: PropTypes.bool.isRequired,
        onVote: PropTypes.func.isRequired,
        replyRef: PropTypes.object.isRequired,
        showReply: PropTypes.bool.isRequired,
        onReplyClick: PropTypes.func.isRequired,
        openDonateDialog: PropTypes.func.isRequired,
        username: PropTypes.string,
    };

    onCancelReplyClick = () => {
        const { replyRef } = this.props;
        replyRef.current.cancel();
    };

    onPostReplyClick = () => {
        const { replyRef } = this.props;
        replyRef.current.post();
    };

    onCancelEditClick = () => {
        const { commentRef } = this.props;
        commentRef.current.cancel();
    };

    onSaveEditClick = () => {
        const { commentRef } = this.props;
        commentRef.current.post();
    };

    onDonateClick = () => {
        const { comment, openDonateDialog } = this.props;
        openDonateDialog(comment.get('author'), comment.get('url'));
    };

    render() {
        const { comment, contentLink, isOwner, showReply, edit, onReplyClick } = this.props;

        if (showReply) {
            return (
                <FooterConfirm>
                    <ButtonConfirm onClick={this.onCancelReplyClick}>
                        {tt('g.cancel')}
                    </ButtonConfirm>
                    <Splitter />
                    <ButtonConfirm main onClick={this.onPostReplyClick}>
                        {tt('g.publish')}
                    </ButtonConfirm>
                </FooterConfirm>
            );
        } else if (edit) {
            return (
                <FooterConfirm>
                    <ButtonConfirm onClick={this.onCancelEditClick}>{tt('g.cancel')}</ButtonConfirm>
                    <Splitter />
                    <ButtonConfirm main onClick={this.onSaveEditClick}>
                        {tt('g.save')}
                    </ButtonConfirm>
                </FooterConfirm>
            );
        }

        return (
            <Wrapper>
                <CommentVotePanel
                    contentLink={`${comment.get('author')}/${comment.get('permlink')}`}
                />
                <CommentRightButtons>
                    {!isOwner && (
                        <Fragment>
                            <DonateButton
                                role="button"
                                data-tooltip={tt('g.donate')}
                                aria-label={tt('g.donate')}
                                onClick={this.onDonateClick}
                            >
                                <Icon size="20" name="coins_plus" />
                            </DonateButton>
                            <DonateSplitter />
                        </Fragment>
                    )}
                    <CommentReplyBlock
                        count={comment.get('children')}
                        link={contentLink}
                        text={tt('g.reply')}
                        notOwner={!isOwner}
                        onReplyClick={onReplyClick}
                    />
                </CommentRightButtons>
            </Wrapper>
        );
    }
}
