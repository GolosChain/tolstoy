import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import { Map } from 'immutable';

import { detransliterate } from 'app/utils/ParsersAndFormatters';
import Icon from 'golos-ui/Icon';
import { TagLink } from 'golos-ui/Tag';
import { EntryWrapper, PostTitle, PostContent } from '../common';
import VotePanel from '../../common/VotePanel';
import ReplyBlock from '../../common/ReplyBlock';
import CardAuthor from '../CardAuthor';
import { getImageSrc } from 'src/app/helpers/images';
import { isContainTags } from 'app/utils/StateFunctions';

const PREVIEW_IMAGE_SIZE = '859x356';

const Header = styled.div`
    padding: 10px 0;
    flex-shrink: 0;
`;

const HeaderRepost = styled(Header)`
    padding: 0 0 10px;

    ${is('tape')`
        position: relative;
    `}
`;

const HeaderLine = styled.div`
    display: flex;
    align-items: center;
    padding: 2px 18px;
    pointer-events: none;

    & > * {
        pointer-events: initial;
    }
`;

const HeaderLineGrid = styled(HeaderLine)`
    padding: 4px 18px;
`;

const Category = styled(TagLink)`
    margin-right: 14px;
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

    ${is('compact')`
        flex-shrink: 1;
        flex-grow: 1;
        overflow: hidden;
    `};

    &:visited {
        ${PostTitle} {
            color: #999;
        }
    }
`;

const Body = styled.div`
    position: relative;
    padding: 0 18px 12px;
`;

const RepostBody = styled(Body)`
    margin-bottom: 10px;
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

    ${is('compact')`
        flex-direction: column;
        align-items: center;
    `};
`;

const VotePanelStyled = styled(VotePanel)`
    ${is('compact')`
        padding: 0;
        padding-bottom: 15px;
        justify-content: space-around;
    `};
`;

const VotePanelWrapper = styled.div`
    ${is('compact')`
        display: flex;
        justify-content: flex-start;
        width: 100%;
        padding: 0 18px;

        @media (max-width: 689px) {
            justify-content: center;
            padding: 0;
        }
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

    ${is('compact')`
        height: 183px;
    `};
`;

const Filler = styled.div`
    flex-grow: 1;
`;

const Root = styled(EntryWrapper)`
    position: relative;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    ${is('gray')`
        opacity: 0.37;
        transition: opacity 0.25s;

        &:hover {
            opacity: 1;
        }
    `};
`;

@withRouter
export default class PostCard extends PureComponent {
    static propTypes = {
        // external
        permLink: PropTypes.string.isRequired,
        compact: PropTypes.bool,
        showPinButton: PropTypes.bool,
        onClick: PropTypes.func,

        // connect
        myAccount: PropTypes.string,
        isNsfw: PropTypes.bool,
        nsfwPref: PropTypes.string,
        data: PropTypes.object,
        postLink: PropTypes.string.isRequired,
        sanitizedData: PropTypes.object,
        isRepost: PropTypes.bool,
        repostHtml: PropTypes.object,
        isFavorite: PropTypes.bool,
        pinDisabled: PropTypes.bool,
        isPinned: PropTypes.bool,
        isOwner: PropTypes.bool,
        reblogData: PropTypes.instanceOf(Map),
    };

    static defaultProps = {
        onClick: () => {},
        hideNsfw: false,
    };

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        const { className, isRepost, hideNsfw, stats, isHidden } = this.props;

        // user wishes to hide these posts entirely
        if (hideNsfw || isHidden) {
            return null;
        }

        return (
            <Root className={className} gray={stats.gray || stats.hide}>
                {this.renderHeader()}
                {isRepost ? this.renderRepostPart() : null}
                {this.renderBody()}
                {this.renderFooter()}
            </Root>
        );
    }

    renderHeader() {
        const { data, isRepost, compact, reblogData, params, postInTape } = this.props;

        const category = detransliterate(data.get('category'));
        let author;
        let created;

        if (isRepost) {
            author = reblogData.get('repostAuthor');
            created = reblogData.get('date');
        } else {
            author = data.get('author');
            created = data.get('created');
        }

        const currentFeed =
            params.order && params.category !== 'feed' ? `/${params.order}` : '/trending';
        const categoryUri = `${currentFeed}?tags=${category}`;

        return (
            <Header>
                <HeaderLine>
                    <CardAuthor
                        infoPopover={postInTape}
                        contentLink={data.get('url')}
                        permLink={data.get('permlink')}
                        author={author}
                        created={created}
                    />
                    <Filler />
                    {compact ? null : (
                        <Category
                            to={categoryUri}
                            category={1}
                            aria-label={tt('aria_label.category', { category: category })}
                        >
                            {category}
                        </Category>
                    )}
                    <Toolbar>
                        {this.renderEditButton()}
                        {this.renderPinButton()}
                        {this.renderRepostButton()}
                        {this.renderFavoriteButton()}
                    </Toolbar>
                </HeaderLine>
                {compact ? (
                    <HeaderLineGrid>
                        <Category to={categoryUri} category={1}>
                            {category}
                        </Category>
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
                    <IconWrapper
                        enabled
                        role="button"
                        aria-label={tt('g.edit')}
                        data-tooltip={tt('g.edit')}
                    >
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
                    role="button"
                    aria-label={pinTip}
                    data-tooltip={pinTip}
                    enabled={!pinDisabled}
                    isPinned={isPinned}
                    onClick={!pinDisabled ? this.onPinClick : null}
                >
                    <Icon name="pin" width={23} height={23} />
                </IconWrapper>
            </ToolbarAction>
        );
    }

    renderRepostButton() {
        const { allowRepost } = this.props;

        if (allowRepost) {
            return (
                <ToolbarAction>
                    <IconWrapper
                        role="button"
                        aria-label={tt('post_card.repost')}
                        data-tooltip={tt('post_card.repost')}
                        enabled
                        onClick={this._onRepostClick}
                    >
                        <Icon name="repost" width={25} />
                    </IconWrapper>
                </ToolbarAction>
            );
        }
    }

    renderFavoriteButton() {
        const { isFavorite } = this.props;

        const favoriteText = isFavorite
            ? tt('post_card.remove_from_favorites')
            : tt('post_card.add_to_favorites');

        return (
            <ToolbarAction>
                <IconWrapper
                    role="button"
                    aria-label={favoriteText}
                    data-tooltip={favoriteText}
                    enabled
                    onClick={this._onFavoriteClick}
                >
                    <Icon name={isFavorite ? 'star_filled' : 'star'} width={24} />
                </IconWrapper>
            </ToolbarAction>
        );
    }

    renderRepostPart() {
        const { repostHtml, data, postLink, postInTape } = this.props;

        return (
            <RepostBlock>
                {repostHtml ? (
                    <RepostBody>
                        <PostContent dangerouslySetInnerHTML={repostHtml} />
                    </RepostBody>
                ) : null}
                <HeaderRepost tape={postInTape}>
                    <HeaderLine>
                        <CardAuthor
                            infoPopover={postInTape}
                            popoverOffsetTop={42}
                            contentLink={postLink}
                            author={data.get('author')}
                            permLink={data.get('permlink')}
                            created={data.get('created')}
                            isRepost
                        />
                        <Filler />
                    </HeaderLine>
                </HeaderRepost>
            </RepostBlock>
        );
    }

    renderBody() {
        const { compact, sanitizedData, stats, data, warnNsfw } = this.props;
        const withImage = sanitizedData.image_link && !stats.gray && !stats.hide;
        const imageLink =
            warnNsfw && isContainTags(data, ['nsfw'])
                ? '/images/nsfw/nsfw.svg'
                : getImageSrc(PREVIEW_IMAGE_SIZE, sanitizedData.image_link);

        return (
            <BodyLink
                to={sanitizedData.link}
                compact={compact ? 1 : 0}
                onClick={this.props.onClick}
            >
                {withImage ? <PostImage compact={compact} src={imageLink} /> : null}
                <Body>
                    <PostTitle>{sanitizedData.title}</PostTitle>
                    <PostContent dangerouslySetInnerHTML={sanitizedData.html} />
                </Body>
            </BodyLink>
        );
    }

    renderFooter() {
        const { data, sanitizedData, compact, permLink } = this.props;

        return (
            <Footer compact={compact}>
                <VotePanelWrapper compact={compact}>
                    <VotePanelStyled contentLink={permLink} compact={compact} />
                </VotePanelWrapper>
                {compact ? null : <Filler />}
                <ReplyBlock
                    compact={compact}
                    count={data.get('children')}
                    link={sanitizedData.link}
                    text={tt('g.reply')}
                />
            </Footer>
        );
    }

    _onFavoriteClick = () => {
        const { postLink, isFavorite } = this.props;

        this.props.toggleFavorite(postLink, !isFavorite);
    };

    _onRepostClick = () => {
        const { postLink } = this.props;

        this.props.openRepostDialog(postLink);
    };

    onPinClick = () => {
        const { postLink, isPinned } = this.props;

        this.props.togglePin(postLink, !isPinned);
    };
}
