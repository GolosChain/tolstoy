import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import { Map } from 'immutable';

import { detransliterate } from 'app/utils/ParsersAndFormatters';
import Icon from 'golos-ui/Icon';
import { PostTitle, PostContent } from '../common';
import VotePanel from '../../common/VotePanel';
import ReplyBlock from '../../common/ReplyBlock';
import CardAuthor from '../CardAuthor';

const PREVIEW_IMAGE_SIZE = '859x356';

const Header = styled.div`
    padding: 10px 0;
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

const HeaderLineGrid = styled(HeaderLine)`
    padding: 4px 18px;
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
    background: #2879ff;
    cursor: default;
`;

const Toolbar = styled.div`
    display: flex;
    align-items: center;
`;

const ToolbarAction = styled.div`
    flex-shrink: 0;
    margin-right: 10px;

    &:last-child {
        margin-right: 0 !important;
    }

    @media (max-width: 700px) {
        margin-right: 6px;
    }
`;

const ToolbarEditAction = styled(ToolbarAction.withComponent(Link))`
    @media (max-width: 880px) {
        display: none;
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: #393636;

    ${is('enabled')`
        cursor: pointer;
        transition: transform 0.15s;

        &:hover {
            transform: scale(1.15);
        }
    `};

    ${is('isPinned')`
        & ${Icon} {
            color: #2879ff;
        }
    `};
`;

const BodyLink = styled(Link)`
    display: block;
    transition: none !important;

    ${is('grid')`
        flex-shrink: 1;
        flex-grow: 1;
        overflow: hidden;
    `};
`;

const Body = styled.div`
    position: relative;
    padding: 0 18px 12px;
`;

const RepostBody = styled(Body)`
    border-bottom: 1px solid #e1e1e1;
`;

const RepostBlock = styled.div``;

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
        padding-bottom: 15px;
        justify-content: space-around;
    `};
`;

const PostImage = styled.div.attrs({
    style: ({ src }) => ({
        backgroundImage: `url(${src})`,
    }),
})`
    width: 100%;
    height: 356px;
    max-height: 60vh;
    margin-bottom: 14px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    ${is('grid')`
        height: 183px;
    `};
`;

const Filler = styled.div`
    flex-grow: 1;
`;

const Root = styled.div`
    position: relative;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    ${is('grid')`
        display: flex;
        flex-direction: column;
    `};
`;

export default class PostCard extends PureComponent {
    static propTypes = {
        permLink: PropTypes.string.isRequired,
        postLink: PropTypes.string.isRequired,
        myAccount: PropTypes.string,
        data: PropTypes.object,
        grid: PropTypes.bool,
        pageAccountName: PropTypes.string,
        showPinButton: PropTypes.bool,
        pinDisabled: PropTypes.bool,
        isPinned: PropTypes.bool,
        isRepost: PropTypes.bool,
        additionalData: PropTypes.instanceOf(Map),
        onClick: PropTypes.func,
    };

    static defaultProps = {
        onClick: () => {},
    };

    componentDidMount() {
        window.addEventListener('resize', this._onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize);
    }

    render() {
        const { className, isRepost, grid } = this.props;

        return (
            <Root className={className} grid={grid}>
                {this.renderHeader()}
                {isRepost ? this.renderRepostPart() : null}
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
                    <CardAuthor author={author} created={created} />
                    <Filler />
                    {grid ? null : <Category>{category}</Category>}
                    <Toolbar>
                        {this.renderEditButton()}
                        {this.renderPinButton()}
                        {this.renderRepostButton()}
                        {this.renderFavoriteButton()}
                    </Toolbar>
                </HeaderLine>
                {grid ? (
                    <HeaderLineGrid>
                        <Category>{category}</Category>
                        <Filler />
                    </HeaderLineGrid>
                ) : null}
            </Header>
        );
    }

    renderEditButton() {
        const { isOwner, sanitizedData, showPinButton } = this.props;

        if (showPinButton && isOwner) {
            return (
                <ToolbarEditAction to={`${sanitizedData.link}/edit`}>
                    <IconWrapper enabled data-tooltip={tt('g.edit')}>
                        <Icon name="pen" width={23} height={23} />
                    </IconWrapper>
                </ToolbarEditAction>
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
                    isPinned={isPinned}
                    data-tooltip={pinTip}
                    onClick={!pinDisabled ? this._onPinClick : null}
                >
                    <Icon name="pin" width={23} height={23} />
                </IconWrapper>
            </ToolbarAction>
        );
    }

    renderRepostButton() {
        const { isOwner, isRepost, myAccount, additionalData } = this.props;

        if (isOwner || (isRepost && additionalData.get('repostAuthor') === myAccount)) {
            return;
        }

        return (
            <ToolbarAction>
                <IconWrapper
                    data-tooltip={tt('post_card.repost')}
                    enabled
                    onClick={this._onRepostClick}
                >
                    <Icon name="repost" width={25} />
                </IconWrapper>
            </ToolbarAction>
        );
    }

    renderFavoriteButton() {
        const { isOwner, isFavorite } = this.props;

        if (isOwner) {
            return;
        }

        return (
            <ToolbarAction>
                <IconWrapper
                    data-tooltip={
                        isFavorite
                            ? tt('post_card.remove_from_favorites')
                            : tt('post_card.add_to_favorites')
                    }
                    enabled
                    onClick={this._onFavoriteClick}
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={24} />
                </IconWrapper>
            </ToolbarAction>
        );
    }

    renderRepostPart() {
        const { repostHtml, data } = this.props;

        return (
            <RepostBlock>
                {repostHtml ? (
                    <RepostBody>
                        <PostContent dangerouslySetInnerHTML={repostHtml} />
                    </RepostBody>
                ) : null}
                <Header>
                    <HeaderLine>
                        <CardAuthor
                            author={data.get('author')}
                            created={data.get('created')}
                            isRepost
                        />
                        <Filler />
                    </HeaderLine>
                </Header>
            </RepostBlock>
        );
    }

    renderBody() {
        const { grid, sanitizedData } = this.props;
        const withImage = sanitizedData.image_link;

        return (
            <BodyLink to={sanitizedData.link} grid={grid ? 1 : 0} onClick={this._onClick}>
                {withImage ? (
                    <PostImage grid={grid} src={this._getImageSrc(sanitizedData.image_link)} />
                ) : null}
                <Body>
                    <PostTitle>{sanitizedData.title}</PostTitle>
                    <PostContent dangerouslySetInnerHTML={sanitizedData.html} />
                </Body>
            </BodyLink>
        );
    }

    _getImageSrc(url) {
        const proxy = $STM_Config.img_proxy_prefix;

        if (proxy) {
            return `${proxy}${PREVIEW_IMAGE_SIZE}/${url}`;
        } else {
            return url;
        }
    }

    renderFooter() {
        const { data, sanitizedData, grid, permLink } = this.props;

        return (
            <Footer grid={grid}>
                <VotePanelStyled contentLink={permLink} grid={grid} />
                {grid ? null : <Filler />}
                <ReplyBlock
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

    _onFavoriteClick = () => {
        const { postLink, isFavorite } = this.props;

        this.props.toggleFavorite(postLink, !isFavorite);
    };

    _onRepostClick = () => {
        const { postLink } = this.props;

        this.props.openRepostDialog(postLink);
    };

    _onPinClick = () => {
        const { postLink, isPinned } = this.props;

        this.props.togglePin(postLink, !isPinned);
    };
}
