import React, { Component, createRef } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import by from 'styled-by';
import tt from 'counterpart';
import throttle from 'lodash/throttle';

import Icon from 'src/app/components/golos-ui/Icon';

import { confirmVote } from 'src/app/helpers/votes';
import { Action } from 'src/app/components/post/SidePanelAction';
import SharePopover from 'src/app/components/post/SharePopover';
import { PopoverStyled } from 'src/app/components/post/PopoverAdditionalStyles';
import PostActions from 'src/app/components/post/PostActions';
import { POST_MAX_WIDTH } from 'src/app/containers/post/PostContainer';

const PANEL_MARGIN = 20;
const FOOTER_HEIGHT = 324;
const HEADER_HEIGHT = 60;
const SIDE_PANEL_WIDTH = 64;
const SIDE_BLOCK_HEIGHT = 429;

const PanelWrapper = styled.div`
    padding: 15px 22px;
    border-radius: 32px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    opacity: 1;

    & > * {
        padding: 10px 0;
    }
`;

const Wrapper = styled.div`
    display: none;
    position: fixed;
    left: calc(50% - ${() => POST_MAX_WIDTH / 2 + SIDE_PANEL_WIDTH / 2}px);
    z-index: 2;
    
    width: ${SIDE_PANEL_WIDTH}px;
    min-height: 50px;
    
    ${is('showSideBlock')`
        display: block
    `}

    @media (max-height: ${SIDE_BLOCK_HEIGHT + PANEL_MARGIN * 2 + HEADER_HEIGHT}px) {
        display: none;
    }

    ${by('fixedOn', {
        center: `
            bottom: calc(50% - ${HEADER_HEIGHT / 2}px);
            transform: translateY(50%);
        `,
        bottom: `
            position: absolute;
            bottom: ${PANEL_MARGIN}px;
            transform: translateY(0);
        `,
    })};
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

const BackLink = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;

    width: ${SIDE_PANEL_WIDTH}px;
    height: ${SIDE_PANEL_WIDTH}px;
    margin-top: 40px;

    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
`;

const BackIcon = styled(Icon)`
    display: block;
    width: 50px;
    height: 50px;
    padding: 13px;
`;

export class SidePanel extends Component {
    static propTypes = {
        togglePin: PropTypes.func.isRequired,
        toggleFavorite: PropTypes.func.isRequired,
    };

    state = {
        showSharePopover: false,
        fixedOn: 'center',
        showSideBlock: true,
    };

    sideBlockRef = createRef();

    componentDidMount() {
        this.scrollScreenLazy();
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

    scrollScreen = () => {
        const panelRect = this.sideBlockRef.current.getBoundingClientRect();

        const documentElem = document.documentElement;
        const bottomBorder = documentElem.scrollHeight - FOOTER_HEIGHT;
        const offsetBottomOfScreen =
            documentElem.scrollTop +
            documentElem.clientHeight / 2 +
            panelRect.height / 2 +
            HEADER_HEIGHT / 2 +
            PANEL_MARGIN;

        let newFixedOn = 'center';
        if (bottomBorder <= offsetBottomOfScreen) {
            newFixedOn = 'bottom';
        }

        if (this.state.fixedOn !== newFixedOn) {
            this.setState({
                fixedOn: newFixedOn,
            });
        }
    };

    scrollScreenLazy = throttle(this.scrollScreen, 20);

    resizeScreen = () => {
        const windowInnerWidth = document.documentElement.clientWidth;
        const { showSideBlock } = this.state;
        const leftBorder = POST_MAX_WIDTH + SIDE_PANEL_WIDTH + PANEL_MARGIN * 2;

        if (windowInnerWidth < leftBorder && showSideBlock) {
            this.setState({ showSideBlock: false });
        }
        if (windowInnerWidth >= leftBorder && !showSideBlock) {
            this.setState({ showSideBlock: true }, () => this.scrollScreenLazy());
        }
    };

    resizeScreenLazy = throttle(this.resizeScreen, 20);

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
            postUrl,
            myVote: voteType,
        } = this.props;
        const { showSharePopover, fixedOn, showSideBlock } = this.state;
        const { likes, firstLikes, dislikes, firstDislikes, backURL } = votesSummary;
        return (
            <Wrapper innerRef={this.sideBlockRef} fixedOn={fixedOn} showSideBlock={showSideBlock}>
                <PanelWrapper>
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
                            showSharePopover
                                ? undefined
                                : tt('postfull_jsx.share_in_social_networks')
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
                    <PostActions
                        postUrl={postUrl}
                        isFavorite={isFavorite}
                        isPinned={isPinned}
                        isOwner={isOwner}
                        toggleFavorite={toggleFavorite}
                        togglePin={togglePin}
                    />
                </PanelWrapper>
                <BackLink to={backURL} onClick={this.onBackClick} data-tooltip={tt('g.turn_back')}>
                    <BackIcon name="arrow_left" />
                </BackLink>
            </Wrapper>
        );
    }
}
