import React, { Component } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import is, { isNot } from 'styled-is';
import { connect } from 'react-redux';
import tt from 'counterpart';

import { confirmVote } from 'src/app/helpers/votes';
import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { onVote } from 'src/app/redux/actions/vote';
import { sidePanelSelector } from 'src/app/redux/selectors/post/sidePanel';
import { reblog } from 'src/app/redux/actions/posts';
import { Action } from 'src/app/components/post/SidePanelAction';
import SharePopover from 'src/app/containers/post/SharePopover';
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

@connect(
    sidePanelSelector,
    {
        toggleFavorite: toggleFavoriteAction,
        onVote,
        reblog,
    }
)
export default class SidePanel extends Component {
    state = {
        showPanel: true,
        fixedOnScreen: true,
        showSharePopover: false,
    };

    componentDidMount() {
        this._resizeScreenLazy();
        window.addEventListener('scroll', this._scrollScreenLazy);
        window.addEventListener('resize', this._resizeScreenLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._scrollScreenLazy);
        window.removeEventListener('resize', this._resizeScreenLazy);
        this._scrollScreenLazy.cancel();
        this._resizeScreenLazy.cancel();
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

    _setWrapperRef = ref => {
        this.wrapperRef = ref;
    };

    _scrollScreen = () => {
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

    _resizeScreen = () => {
        const wrapperOffsetTop = this.wrapperRef.offsetTop;
        if (wrapperOffsetTop <= HEADER_HEIGHT + PADDING_FROM_HEADER && this.state.showPanel) {
            this.setState({ showPanel: false });
        }
        if (wrapperOffsetTop > HEADER_HEIGHT + PADDING_FROM_HEADER && !this.state.showPanel) {
            this.setState({ showPanel: true });
        }
        this._scrollScreenLazy();
    };

    _scrollScreenLazy = throttle(this._scrollScreen, 25);

    _resizeScreenLazy = throttle(this._resizeScreen, 25);

    _reblog = () => {
        const { username, author, permLink } = this.props;
        this.props.reblog(username, author, permLink);
    };

    _toggleFavorite = () => {
        const { author, permLink, isFavorite } = this.props;
        this.props.toggleFavorite({ link: author + '/' + permLink, isAdd: !isFavorite });
    };

    _like = async () => {
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

    _dislike = async () => {
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
                innerRef={this._setWrapperRef}
                showPanel={showPanel}
                fixedOnScreen={fixedOnScreen}
            >
                <Action
                    activeType={voteType.percent > 0 ? 'like' : ''}
                    iconName="like"
                    count={likes}
                    onClick={this._like}
                    dataTooltip={this.tooltipContent(firstLikes, likes > 10)}
                />
                <Action
                    activeType={voteType.percent < 0 ? 'dislike' : ''}
                    iconName="dislike"
                    count={dislikes}
                    onClick={this._dislike}
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
                    onClick={this._reblog}
                />
                <Action
                    iconName={isFavorite ? 'star_filled' : 'star'}
                    onClick={this._toggleFavorite}
                    dataTooltip={
                        isFavorite ? tt('g.remove_from_favorites') : tt('g.add_to_favorites')
                    }
                />
            </Wrapper>
        );
    }
}
