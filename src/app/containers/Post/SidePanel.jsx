import React, { Component } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import is, { isNot } from 'styled-is';
import { connect } from 'react-redux';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

import { confirmVote } from 'src/app/helpers/votes';
import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { onVote } from 'src/app/redux/actions/vote';
import { sidePanelSelector } from 'src/app/redux/selectors/post/sidePanel';
import { reblog } from 'src/app/redux/actions/posts';

const PADDING_FROM_HEADER = 22;
const HEADER_HEIGHT = 121;
const FOOTER_HEIGHT = 403;

const Wrapper = styled.div`
    position: fixed;
    bottom: 30px;
    left: calc(50% - 684px);
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

const CountOf = styled.div`
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height: 23px;

    ${is('count')`
        padding-top: 5px;
    `};
`;

const ActionButton = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const ActionIconWrapper = styled.div`
    display: flex;
    padding: 5px;
    cursor: pointer;
    transition: transform 0.15s;

    &:hover {
        transform: scale(1.15);
    }

    ${({ activeType }) =>
        activeType === 'like'
            ? `
        color: #2879ff 
    `
            : activeType === 'dislike'
                ? `
        color: #ff4e00
    `
                : ``};
`;

const Action = ({ iconName, count, onClick, dataTooltip, activeType }) => {
    return (
        <ActionButton onClick={onClick} data-tooltip={dataTooltip} data-tooltip-html>
            <ActionIconWrapper activeType={activeType}>
                <Icon width="20" height="20" name={iconName} />
            </ActionIconWrapper>
            <CountOf count={count}>{count}</CountOf>
        </ActionButton>
    );
};

@connect(
    sidePanelSelector,
    {
        toggleFavoriteAction,
        onVote,
        reblog,
    }
)
export default class SidePanel extends Component {
    state = {
        showPanel: true,
        fixedOnScreen: true,
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

    render() {
        const { votesSummary, isFavorite } = this.props;
        const { showPanel, fixedOnScreen } = this.state;
        const { myVote, likes, firstLikes, dislikes, firstDislikes } = votesSummary;
        return (
            <Wrapper
                innerRef={this._setWrapperRef}
                showPanel={showPanel}
                fixedOnScreen={fixedOnScreen}
            >
                <Action
                    activeType={myVote}
                    iconName="like"
                    count={likes}
                    onClick={this._like}
                    dataTooltip={this.tooltipContent(firstLikes, likes > 10)}
                />
                <Action
                    activeType={myVote}
                    iconName="dislike"
                    count={dislikes}
                    onClick={this._dislike}
                    dataTooltip={this.tooltipContent(firstDislikes, dislikes > 10)}
                />
                <Action
                    iconName="repost-right"
                    dataTooltip={tt('g.reblog')}
                    onClick={this._reblog}
                />
                <Action
                    iconName="sharing_triangle"
                    dataTooltip={tt('postfull_jsx.share_in_social_networks')}
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
        this.props.toggleFavoriteAction(author + '/' + permLink, !isFavorite);
    };

    _like = async () => {
        const { username, permLink, author, myVote } = this.props;
        const percent = 1;
        if (await confirmVote(myVote, percent)) {
            this.props.onVote(username, author, permLink, myVote.percent < 0 ? percent : 0);
        }
    };

    _dislike = async () => {
        const { username, permLink, author, myVote } = this.props;
        const percent = -1;
        if (await confirmVote(myVote, percent)) {
            this.props.onVote(username, author, permLink, myVote.percent > 0 ? percent : 0);
        }
    };

    tooltipContent = (users, isMore) => {
        return users.length ? users.join('<br>') + (isMore ? '<br>...' : '') : null;
    };
}
