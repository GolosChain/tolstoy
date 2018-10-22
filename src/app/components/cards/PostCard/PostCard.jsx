import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import Immutable from 'immutable';

import { detransliterate } from 'app/utils/ParsersAndFormatters';
import Icon from 'golos-ui/Icon';
import { confirmVote } from 'src/app/helpers/votes';
import { PostTitle, PostBody } from '../common';
import VotePanel from '../../common/VotePanel';
import ReplyBlock from '../../common/ReplyBlock';
import CardAuthor from '../CardAuthor';

const Header = styled.div`
    padding: 10px 0 6px;
    flex-shrink: 0;
`;

const HeaderLine = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    padding: 2px 18px;
    z-index: 1;
    pointer-events: none;

    & > * {
        pointer-events: initial;
    }
`;

const Category = styled.div`
    height: 28px;
    padding: 0 12px;
    margin-right: 14px;
    border-radius: 6px;
    line-height: 26px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    background: #789821;
    cursor: default;
`;
const Toolbar = styled.div`
    display: flex;
    align-items: center;
`;
const ToolbarAction = styled.div`
    margin-right: 6px;

    &:last-child {
        margin-right: 0;
    }
`;
const ToolbarActionLink = ToolbarAction.withComponent(Link);
const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: ${({ color }) => color || '#393636'};

    ${is('enabled')`
        cursor: pointer;
        transition: transform 0.15s;

        &:hover {
            transform: scale(1.15);
        }
    `};
`;

const BodyLink = styled(Link)`
    display: block;
    transition: none !important;

    ${is('half')`
        width: 62%;
    `};

    ${is('grid')`
        flex-shrink: 1;
        flex-grow: 1;
        overflow: hidden;
    `};
`;

const Body = styled.div`
    position: relative;
    padding: 0 18px;
`;

const RepostBody = styled(PostBody)`
    margin-bottom: 8px;
`;

const Footer = styled.div`
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    z-index: 1;
    pointer-events: none;

    & > * {
        pointer-events: initial;
    }

    ${is('grid')`
        flex-direction: column;
        align-items: center;
    `};
`;

const VotePanelStyled = styled(VotePanel)`
    ${is('grid')`
        padding: 0;
        padding-bottom: 20px;
        justify-content: space-around;
    `};
`;

const PostImage = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 38%;
    border-radius: 0 8px 8px 0;
    background: url('${a => a.src}') no-repeat center;
    background-size: cover;
    z-index: 0;
    overflow: hidden;
    
    &:after {
        position: absolute;
        content: '';
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(100, 100, 100, 0.15);
    }
    
    ${is('grid')`
        top: unset;
        left: 0;
        width: unset;
        height: 173px;
        border-radius: 0 0 8px 8px;
    `}
`;

const Filler = styled.div`
    flex-grow: 1;
`;

const Root = styled.div`
    position: relative;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    ${PostImage}:after {
        background-color: rgba(0, 0, 0, 0);
        transition: background-color 0.15s;
    }

    &:hover ${PostImage}:after {
        background-color: rgba(0, 0, 0, 0.3);
    }

    ${is('grid')`
        display: flex;
        flex-direction: column;
        height: 338px;

        @media (max-width: 890px) {
            height: 355px;
        }
    `};

    &.PostCard_image.PostCard_grid {
        ${VotePanelStyled} {
            opacity: 0;
            transition: opacity 0.25s;
        }

        &:hover ${VotePanelStyled} {
            opacity: 1;
        }

        &:after {
            position: absolute;
            content: '';
            height: 30px;
            left: 0;
            right: 0;
            bottom: 173px;
            background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
            pointer-events: none;
        }
    }
`;

export default class PostCard extends PureComponent {
    static propTypes = {
        permLink: PropTypes.string,
        myAccount: PropTypes.string,
        data: PropTypes.object,
        grid: PropTypes.bool,
        pageAccountName: PropTypes.string,
        showPinButton: PropTypes.bool,
        pinDisabled: PropTypes.bool,
        isPinned: PropTypes.bool,
        isRepost: PropTypes.bool,
        additionalData: PropTypes.instanceOf(Immutable.Map),
        onClick: PropTypes.func,
    };

    static defaultProps = {
        onClick: () => {},
    };

    state = {
        myVote: this._getMyVote(this.props),
    };

    componentDidMount() {
        window.addEventListener('resize', this._onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.data !== newProps.data) {
            this.setState({
                myVote: this._getMyVote(newProps),
            });
        }
    }

    _getMyVote(props) {
        const { data, myAccount } = props;
        const votes = data.get('active_votes');

        for (let vote of votes) {
            if (vote.get('voter') === myAccount) {
                const v = vote.toJS();
                v.weight = parseInt(v.weight || 0, 10);
                return v;
            }
        }

        return null;
    }

    render() {
        const { className, grid } = this.props;

        return (
            <Root className={className} grid={grid}>
                {this.renderHeader()}
                {this.renderBody()}
                {this.renderFooter()}
            </Root>
        );
    }

    renderHeader() {
        const { data, isRepost, additionalData, grid } = this.props;

        const category = detransliterate(data.get('category'));
        let author;
        let originalAuthor;
        let created;

        if (isRepost) {
            author = additionalData.get('repostAuthor');
            created = additionalData.get('date');
            originalAuthor = data.get('author');
        } else {
            author = data.get('author');
            created = data.get('created');
        }

        return (
            <Header>
                <HeaderLine>
                    <CardAuthor
                        author={author}
                        originalAuthor={originalAuthor}
                        created={created}
                        isRepost={isRepost}
                    />
                    <Filler />
                    {grid ? null : <Category>{category}</Category>}
                    <Toolbar>
                        {this.renderEditButton()}
                        {this.renderPinButton()}
                        {this.renderFavoriteButton()}
                    </Toolbar>
                </HeaderLine>
                {grid ? (
                    <HeaderLine>
                        <Category>{category}</Category>
                        <Filler />
                    </HeaderLine>
                ) : null}
            </Header>
        );
    }

    renderEditButton() {
        const { isOwner, grid, sanitizedData, showPinButton } = this.props;

        if (showPinButton && isOwner) {
            return (
                <ToolbarActionLink to={`${sanitizedData.link}/edit`}>
                    <IconWrapper
                        color={sanitizedData.image_link && !grid ? '#fff' : ''}
                        enabled
                        data-tooltip={tt('g.edit')}
                    >
                        <Icon name="pen" width={23} height={23} />
                    </IconWrapper>
                </ToolbarActionLink>
            );
        }
    }

    renderPinButton() {
        const { data, myAccount, showPinButton, isPinned, pinDisabled } = this.props;

        const showPin =
            showPinButton && myAccount === data.get('author') && (!pinDisabled || isPinned);

        if (!showPin) {
            return;
        }

        let pinTip;

        if (showPinButton) {
            if (pinDisabled) {
                if (isPinned) {
                    pinTip = tt('post_card.post_pinned');
                }
            } else {
                if (isPinned) {
                    pinTip = tt('post_card.unpin_post');
                } else {
                    pinTip = tt('post_card.pin_post');
                }
            }
        }

        return (
            <ToolbarAction>
                <IconWrapper
                    enabled={!pinDisabled}
                    data-tooltip={pinTip}
                    onClick={!pinDisabled ? this._onPinClick : null}
                >
                    <Icon name="pin" width={23} height={23} />
                </IconWrapper>
            </ToolbarAction>
        );
    }

    renderFavoriteButton() {
        const { isOwner, grid, isFavorite, sanitizedData } = this.props;

        if (isOwner) {
            return null;
        }

        return (
            <ToolbarAction>
                <IconWrapper
                    color={sanitizedData.image_link && !grid ? '#fff' : ''}
                    data-tooltip={
                        isFavorite
                            ? tt('post_card.remove_from_favorites')
                            : tt('post_card.add_to_favorites')
                    }
                    enabled
                    onClick={this._onFavoriteClick}
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={20} height={20} />
                </IconWrapper>
            </ToolbarAction>
        );
    }

    renderBody() {
        const { grid, isRepost, sanitizedData, repostHtml } = this.props;
        const withImage = sanitizedData.image_link;

        return (
            <BodyLink
                to={sanitizedData.link}
                half={withImage && !grid ? 1 : 0}
                grid={grid ? 1 : 0}
                onClick={this._onClick}
            >
                <Body>
                    {isRepost && repostHtml ? (
                        <RepostBody dangerouslySetInnerHTML={repostHtml} />
                    ) : null}
                    <PostTitle>{sanitizedData.title}</PostTitle>
                    <PostBody dangerouslySetInnerHTML={sanitizedData.html} />
                </Body>
                {withImage ? (
                    <PostImage grid={grid} src={this._getImageSrc(sanitizedData.image_link)} />
                ) : null}
            </BodyLink>
        );
    }

    _getImageSrc(url) {
        const proxy = $STM_Config.img_proxy_prefix;

        if (proxy) {
            return `${proxy}346x194/${url}`;
        } else {
            return url;
        }
    }

    renderFooter() {
        const { data, myAccount, sanitizedData, grid } = this.props;
        const withImage = Boolean(sanitizedData.image_link);

        return (
            <Footer grid={grid}>
                <VotePanelStyled
                    data={data}
                    me={myAccount}
                    whiteTheme={withImage && grid}
                    grid={grid}
                    onChange={this._onVoteChange}
                />
                {grid ? null : <Filler />}
                <ReplyBlock
                    withImage={withImage}
                    grid={grid}
                    count={data.get('children')}
                    link={sanitizedData.link}
                    text={tt('g.reply')}
                />
            </Footer>
        );
    }

    _onClick = e => {
        this.props.onClick(e);
    };

    _onVoteChange = async percent => {
        const props = this.props;
        const { myVote } = this.state;

        if (await confirmVote(myVote, percent)) {
            this.props.onVote(percent, {
                myAccount: props.myAccount,
                author: props.data.get('author'),
                permlink: props.data.get('permlink'),
            });
        }
    };

    _onFavoriteClick = () => {
        const { isFavorite, data } = this.props;

        this.props.toggleFavorite(data.get('author') + '/' + data.get('permlink'), !isFavorite);
    };

    _onPinClick = () => {
        const { data, isPinned } = this.props;

        this.props.togglePin(data.get('author') + '/' + data.get('permlink'), !isPinned);
    };
}
