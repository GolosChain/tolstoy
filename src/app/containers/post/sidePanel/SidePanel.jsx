import React, { Component } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import is, { isNot } from 'styled-is';
import tt from 'counterpart';

import { confirmVote } from 'src/app/helpers/votes';
import { Action } from 'src/app/components/post/SidePanelAction';
import SharePopover from 'src/app/components/post/SharePopover';
import { PopoverStyled } from 'src/app/components/post/PopoverAdditionalStyles';

const PADDING_FROM_HEADER = 22;
const HEADER_HEIGHT = 121;
const FOOTER_HEIGHT = 403;

const Wrapper = styled.div`
    position: fixed;
    bottom: 30px;
    left: calc(50% - 596px);
    width: 64px;
    min-height: 50px;
    padding: 15px 22px;
    border-radius: 32px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    opacity: 1;
    transition: visibility 0.3s, opacity 0.3s;

    ${isNot('fixedOnScreen')`
        position: absolute;
    `};

    ${isNot('showPanel')`
        opacity: 0;
        visibility: hidden;
    `};

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
        showPanel: true,
        fixedOnScreen: true,
        showSharePopover: false,
    };

    componentDidMount() {
        this.resizeScreenLazy();
        window.addEventListener('scroll', this.scrollScreenLazy);
        window.addEventListener('resize', this.resizeScreenLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollScreenLazy);
        window.removeEventListener('resize', this.resizeScreenLazy);
        this.scrollScreenLazy.cancel();
        this.resizeScreenLazy.cancel();
    }

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

    setWrapperRef = ref => {
        this.wrapperRef = ref;
    };

    scrollScreen = () => {
        const documentElem = document.documentElement;
        const bottomBorder = documentElem.scrollHeight - FOOTER_HEIGHT;
        const offsetBottomOfScreen = documentElem.scrollTop + documentElem.clientHeight;
        if (bottomBorder <= offsetBottomOfScreen && this.state.fixedOnScreen) {
            this.setState({ fixedOnScreen: false });
        }
        if (bottomBorder > offsetBottomOfScreen && !this.state.fixedOnScreen) {
            this.setState({ fixedOnScreen: true });
        }
    };

    resizeScreen = () => {
        const wrapperOffsetTop = this.wrapperRef.offsetTop;
        if (wrapperOffsetTop <= HEADER_HEIGHT + PADDING_FROM_HEADER && this.state.showPanel) {
            this.setState({ showPanel: false });
        }
        if (wrapperOffsetTop > HEADER_HEIGHT + PADDING_FROM_HEADER && !this.state.showPanel) {
            this.setState({ showPanel: true });
        }
        this.scrollScreenLazy();
    };

    scrollScreenLazy = throttle(this.scrollScreen, 25);

    resizeScreenLazy = throttle(this.resizeScreen, 25);

    reblog = () => {
        const { username, author, permLink } = this.props;
        this.props.reblog(username, author, permLink);
    };

    toggleFavorite = () => {
        const { author, permLink, isFavorite } = this.props;
        this.props.toggleFavorite({ link: author + '/' + permLink, isAdd: !isFavorite });
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
        const { votesSummary, isFavorite, myVote: voteType } = this.props;
        const { showPanel, fixedOnScreen, showSharePopover } = this.state;
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
                <Action
                    iconName={isFavorite ? 'star_filled' : 'star'}
                    onClick={this.toggleFavorite}
                    dataTooltip={
                        isFavorite ? tt('g.remove_from_favorites') : tt('g.add_to_favorites')
                    }
                />
            </Wrapper>
        );
    }
}
