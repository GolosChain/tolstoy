import React, { Component } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { confirmVote } from 'src/app/helpers/votes';
import { Action } from 'src/app/components/post/SidePanelAction';
import SharePopover from 'src/app/components/post/SharePopover';
import { PopoverStyled } from 'src/app/components/post/PopoverAdditionalStyles';
import PinnedOfFavorite from 'src/app/components/post/PinnedOrFavorite';

const Wrapper = styled.div`
    left: calc(50% - 596px);
    width: 64px;
    min-height: 50px;
    padding: 15px 22px;
    border-radius: 32px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    opacity: 1;
    transition: visibility 0.3s, opacity 0.3s;

    & > * {
        padding: 10px 0;
    }

    @media (max-width: 1407px) {
        opacity: 0;
        visibility: hidden;
    }

    @media (max-width: 1200px) {
        display: none;
    }
`;

const ActionWrapper = styled(Action)`
    position: relative;

    ${is('isOpen')`
        & > div > svg {
            transition: color 0s;
            color: #2578be;
        }
    `};
`;

export class SidePanel extends Component {
    state = {
        showSharePopover: false,
    };

    openSharePopover = () => {
        this.setState({
            showSharePopover: true,
        });
    };

    closeSharePopover = () => {
        this.setState({
            showSharePopover: false,
        });
    };

    reblog = () => {
        const { username, author, permLink } = this.props;
        this.props.reblog(username, author, permLink);
    };

    toggleFavorite = () => {
        const { author, permLink, isFavorite } = this.props;
        this.props.toggleFavoriteAction(author + '/' + permLink, !isFavorite);
    };

    like = async () => {
        const { username, permLink, author, myVote } = this.props;
        const percent = 1;
        if (await confirmVote(myVote, percent)) {
            this.props.onVote(
                username,
                author,
                permLink,
                myVote === 0 || myVote.percent <= 0 ? percent : 0
            );
        }
    };

    dislike = async () => {
        const { username, permLink, author, myVote } = this.props;
        const percent = -1;
        if (await confirmVote(myVote, percent)) {
            this.props.onVote(
                username,
                author,
                permLink,
                myVote === 0 || myVote.percent >= 0 ? percent : 0
            );
        }
    };

    tooltipContent = (users, isMore) => {
        return users.length ? users.join('<br>') + (isMore ? '<br>...' : '') : null;
    };

    render() {
        const {
            votesSummary,
            isPinned,
            togglePin,
            isOwner,
            isFavorite,
            toggleFavorite,
            myVote: voteType,
        } = this.props;
        const { showSharePopover } = this.state;
        const { likes, firstLikes, dislikes, firstDislikes } = votesSummary;
        return (
            <Wrapper
                innerRef={this.setWrapperRef}
                showPanel={showPanel}
                fixedOnScreen={fixedOnScreen}
            >
                <Action
                    activeType={voteType.percent > 0 ? 'like' : ''}
                    iconName="like"
                    count={likes}
                    onClick={this.like}
                    dataTooltip={this.tooltipContent(firstLikes, likes > 10)}
                />
                <Action
                    activeType={voteType.percent < 0 ? 'dislike' : ''}
                    iconName="dislike"
                    count={dislikes}
                    onClick={this.dislike}
                    dataTooltip={this.tooltipContent(firstDislikes, dislikes > 10)}
                />
                <ActionWrapper
                    iconName="sharing_triangle"
                    dataTooltip={
                        showSharePopover ? undefined : tt('postfull_jsx.share_in_social_networks')
                    }
                    isOpen={showSharePopover}
                    onClick={this.openSharePopover}
                >
                    <PopoverStyled
                        position="right"
                        onClose={this.closeSharePopover}
                        show={showSharePopover}
                    >
                        <SharePopover />
                    </PopoverStyled>
                </ActionWrapper>
                <Action
                    iconName="repost-right"
                    dataTooltip={tt('g.reblog')}
                    onClick={this.reblog}
                />
                <PinnedOfFavorite
                    isFavorite={isFavorite}
                    isPinned={isPinned}
                    isOwner={isOwner}
                    toggleFavorite={toggleFavorite}
                    togglePin={togglePin}
                />
            </Wrapper>
        );
    }
}
