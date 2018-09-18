import React, { Component } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import Icon from '../../components/golos-ui/Icon/Icon';
import is, { isNot } from 'styled-is';
import { connect } from 'react-redux';
import {
    authorSelector,
    currentPostSelector,
    currentUsernameSelector,
    repostSelector,
    votesSummarySelector,
} from '../../redux/selectors/post/post';
import { toggleFavoriteAction } from '../../redux/actions/favorites';
import { confirmVote } from '../../helpers/votes';
import { onVote } from '../../redux/actions/vote';

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
    transition: visibility 0s linear 0s, opacity 0.3s;

    ${isNot('fixedOnScreen')`
        position: absolute;
    `};

    ${isNot('showPanel')`
        opacity: 0;
        transition: visibility 0s linear .3s, opacity .3s;
        visibility: hidden;
    `};

    & > div {
        padding: 10px 0;
    }

    @media (max-width: 1407px) {
        opacity: 0;
        transition: visibility 0s linear 0.3s, opacity 0.3s;
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
`;

const ActionBlock = ({ iconName, count, onClick, dataTooltip }) => {
    return (
        <ActionButton onClick={onClick} data-tooltip={dataTooltip}>
            <ActionIconWrapper>
                <Icon width="20" height="20" name={iconName} />
            </ActionIconWrapper>
            <CountOf count={count}>{count}</CountOf>
        </ActionButton>
    );
};

class SidePanel extends Component {
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
    }

    render() {
        const { votesSummary, repost, isFavorite } = this.props;
        const { showPanel, fixedOnScreen } = this.state;
        return (
            <Wrapper
                innerRef={this._setWrapperRef}
                showPanel={showPanel}
                fixedOnScreen={fixedOnScreen}
            >
                <ActionBlock iconName="like" count={votesSummary.likes} onClick={this._like} />
                <ActionBlock
                    iconName="dislike"
                    count={votesSummary.dislikes}
                    onClick={this._dislike}
                />
                <ActionBlock iconName="repost-right" count={repost} />
                <ActionBlock iconName="sharing_triangle" />
                <ActionBlock
                    iconName={isFavorite ? 'star_filled' : 'star'}
                    onClick={this._toggleFavorite}
                    dataTooltip={isFavorite ? 'Убрать из избранного' : 'В избранное'}
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

    _scrollScreenLazy = throttle(this._scrollScreen, 25, { leading: true });

    _resizeScreenLazy = throttle(this._resizeScreen, 25, { leading: true });

    _toggleFavorite = () => {
        const { author, permLink, isFavorite } = this.props;
        this.props.toggleFavorite(author + '/' + permLink, !isFavorite);
    };

    _like = async () => {
        const { username, permLink, author, myVote } = this.props;
        const percent = 1;
        if (await confirmVote(myVote, percent)) {
            this.props.onVote(username, author, permLink, !myVote.percent ? percent : 0);
        }
    };

    _dislike = async () => {
        const { username, permLink, author, myVote } = this.props;
        const percent = -1;
        if (await confirmVote(myVote, percent)) {
            this.props.onVote(username, author, permLink, !myVote.percent ? percent : 0);
        }
    };
}

const mapStateToProps = (state, props) => {
    const post = currentPostSelector(state, props);
    const author = authorSelector(state, props);
    const username = currentUsernameSelector(state);
    return {
        votesSummary: votesSummarySelector(state, props),
        repost: repostSelector(state, props),
        isFavorite: post.isFavorite,
        author: author.account,
        permLink: post.permLink,
        username,
        myVote: post.myVote,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleFavorite: (link, isAdd) => {
            dispatch(toggleFavoriteAction({ link, isAdd }));
        },
        onVote: (voter, author, permLink, percent) => {
            dispatch(onVote(voter, author, permLink, percent));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SidePanel);
