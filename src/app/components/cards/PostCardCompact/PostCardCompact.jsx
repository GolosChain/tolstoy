import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router';
import styled, { css } from 'styled-components';
import is from 'styled-is';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import tt from 'counterpart';

import Icon from 'src/app/components/golos-ui/Icon';
import { listenLazy } from 'src/app/helpers/hoc';
import { getImageSrc } from 'src/app/helpers/images';
import { breakWordStyles } from 'src/app/helpers/styles';
import { smartTrim } from 'src/app/helpers/text';
import { VotePanelCompact } from 'src/app/components/common/VotePanel';
import { ReplyBlock } from '../../common/ReplyBlock';
import CompactPostCardMenu from 'src/app/components/common/CompactPostCardMenu';
import { detransliterate, repLog10 } from 'app/utils/ParsersAndFormatters';

const TWO_LINE_THRESHOLD = 1020;
const MOBILE_THRESHOLD = 500;
const PREVIEW_WIDTH = 148;
const PREVIEW_HEIGHT = 80;
const MOBILE_PREVIEW_WIDTH = 108;
const MOBILE_PREVIEW_HEIGHT = 60;
const PREVIEW_SIZE = `${PREVIEW_WIDTH}x${PREVIEW_HEIGHT}`;

const MOBILE_TEXT_LENGTH_LIMIT = 120;

const Root = styled.div`
    padding: 20px 20px 8px;
    margin-bottom: 20px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: ${MOBILE_THRESHOLD}px) {
        padding: 16px 16px 10px;
        margin-bottom: 10px;
        border-radius: 0;
    }
`;

const Body = styled.div`
    overflow: hidden;
`;

const PostTitle = styled.div`
    margin: -1px 0 9px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.13;
    color: #393636;
    ${breakWordStyles};

    @media (max-width: ${MOBILE_THRESHOLD}px) {
        margin-bottom: 4px;
        line-height: 1.14;
        font-size: 14px;
    }
`;

const activeStyle = css`
    color: #959595;
    cursor: pointer;
    transition: color 0.15s;

    &:focus,
    &:hover {
        color: #333;
    }
`;

const LinkStyled = styled(Link)`
    ${activeStyle};
`;

const PostContent = styled.div`
    font-size: 14px;
    line-height: 1.29;
    color: #393636;
    ${breakWordStyles};

    @media (max-width: ${MOBILE_THRESHOLD}px) {
        font-size: 12px;
        line-height: 1.08;
    }
`;

const BodyBlock = styled.div`
    display: flex;
`;

const PostImage = styled.img`
    width: ${PREVIEW_WIDTH}px;
    height: ${PREVIEW_HEIGHT}px;
    border-radius: 6px;

    @media (max-width: ${MOBILE_THRESHOLD}px) {
        width: ${MOBILE_PREVIEW_WIDTH}px;
        height: ${MOBILE_PREVIEW_HEIGHT}px;
    }
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    min-height: 20px;
`;

const Splitter = styled.div`
    flex-shrink: 0;
    width: 1px;
    height: 20px;
    margin: 0 10px;
    background: #e1e1e1;

    @media (max-width: 1100px) {
        margin: 0 5px;
    }

    @media (max-width: 370px) {
        margin: 0;
    }

    @media (max-width: 340px) {
        margin: 0 -1px;
    }
`;

const DetailsBlock = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #959595;
    user-select: none;
    overflow: hidden;

    ${is('inbody')`
        margin-top: 5px;
        font-size: 13px;
        
        @media (max-width: 500px) {
            line-height: 1.2;
            font-size: 10px;
        }
    `};
`;

const DateLink = styled(LinkStyled)`
    padding-right: 3px;

    ${is('leftpadding')`
        padding-left: 10px;    
    `};
`;

const AuthorLink = styled(LinkStyled)`
    padding-left: 3px;
    padding-right: 3px;
    user-select: none;
    white-space: nowrap;

    &:hover * {
        border-color: #333;
    }
`;

const RepostArrowIcon = styled(Icon).attrs({ name: 'repost_solid' })`
    width: 9px;
    margin: 0 2px;

    @media (max-width: 500px) {
        margin: 0;
    }
`;

const AuthorName = styled.div`
    display: inline-block;
    font-weight: 500;
`;

const AuthorRating = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 18px;
    margin: -10px 0 -10px 4px;
    border: 1px solid #b7b7b9;
    border-radius: 100px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    transition: border-color 0.15s;

    @media (max-width: 500px) {
        width: 12px;
        height: 12px;
        line-height: 12px;
        font-size: 8px;
    }
`;

const CategoryLink = styled(LinkStyled)`
    padding-right: 10px;
    padding-left: 4px;
    max-width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CategoryLinkIn = styled.span`
    color: #959595;
`;

const ImageLink = styled(Link)`
    flex-shrink: 0;
    margin-right: 19px;

    @media (max-width: ${MOBILE_THRESHOLD}px) {
        margin-right: 15px;
    }
`;

const BodyLink = styled(Link)`
    display: block;
`;

const RepostButton = styled.button`
    padding: 0 10px;
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
    -webkit-appearance: none;
    ${activeStyle};
`;

const RepostIcon = styled(Icon).attrs({
    name: 'repost',
})`
    display: block;
    width: 17px;

    @media (max-width: 500px) {
        width: 15px;
    }
`;

const Filler = styled.div`
    flex-grow: 1;
`;

const MenuWrapper = styled.div`
    position: relative;
`;

const DotsIcon = styled(Icon).attrs({
    name: 'dots_horizontal',
})`
    display: block;
    width: 38px;
    padding: 0 10px;
    margin-right: -10px;
    color: #959595;
    user-select: none;
    ${activeStyle};

    @media (max-width: 500px) {
        width: 34px;
    }
`;

@withRouter
@listenLazy('resize')
export default class PostCardCompact extends PureComponent {
    state = {
        menu: false,
        twoLines: process.env.BROWSER ? window.innerWidth < TWO_LINE_THRESHOLD : false,
        mobile: process.env.BROWSER ? window.innerWidth < MOBILE_THRESHOLD : false,
    };

    onRepostClick = () => {
        this.props.openRepostDialog(this.props.postLink);
    };

    onMenuHandlerClick = () => {
        this.setState({
            menu: true,
        });
    };

    onMenuClose = () => {
        this.setState({
            menu: false,
        });
    };

    // called by @listenLazy
    onResize = () => {
        this.setState({
            twoLines: window.innerWidth < TWO_LINE_THRESHOLD,
            mobile: window.innerWidth < MOBILE_THRESHOLD,
        });
    };

    renderBody() {
        const { sanitizedData, stats } = this.props;
        const { twoLines, mobile } = this.state;
        const withImage = sanitizedData.image_link && !stats.gray && !stats.hide;

        return (
            <BodyBlock to={sanitizedData.link} onClick={this.props.onClick}>
                {withImage ? (
                    <ImageLink to={sanitizedData.link} onClick={this.props.onClick}>
                        <PostImage
                            alt={tt('aria_label.post_image')}
                            src={getImageSrc(PREVIEW_SIZE, sanitizedData.image_link)}
                        />
                    </ImageLink>
                ) : null}
                <Body>
                    <BodyLink to={sanitizedData.link} onClick={this.props.onClick}>
                        <PostTitle>{sanitizedData.title}</PostTitle>
                        <PostContent
                            dangerouslySetInnerHTML={{
                                __html: mobile
                                    ? smartTrim(sanitizedData.desc, MOBILE_TEXT_LENGTH_LIMIT)
                                    : sanitizedData.desc,
                            }}
                        />
                    </BodyLink>
                    {twoLines ? this.renderDetails() : null}
                </Body>
            </BodyBlock>
        );
    }

    renderRepostButton() {
        const { allowRepost } = this.props;

        if (allowRepost) {
            return (
                <Fragment>
                    <Splitter />
                    <RepostButton
                        aria-label={tt('post_card.repost')}
                        data-tooltip={tt('post_card.repost')}
                        onClick={this.onRepostClick}
                    >
                        <RepostIcon />
                    </RepostButton>
                </Fragment>
            );
        }
    }

    renderDetails(inFooter) {
        const { data, params, isRepost, reblogData } = this.props;

        const category = detransliterate(data.get('category'));
        const categoryTooltip = tt('aria_label.category', { category: category });
        const currentFeed = params.order ? `/${params.order}` : '/trending';
        let created;

        if (isRepost) {
            created = reblogData.get('date');
        } else {
            created = data.get('created');
        }

        return (
            <DetailsBlock inbody={!inFooter}>
                <DateLink
                    to={data.get('url')}
                    data-tooltip={new Date(created).toLocaleString()}
                    leftpadding={inFooter ? 1 : 0}
                >
                    <FormattedRelative value={created} />
                </DateLink>
                {isRepost ? (
                    <Fragment>
                        <AuthorLink to={`/@${reblogData.get('repostAuthor')}`}>
                            <AuthorName>{reblogData.get('repostAuthor')}</AuthorName>
                        </AuthorLink>
                        <RepostArrowIcon />
                    </Fragment>
                ) : null}
                <AuthorLink to={`/@${data.get('author')}`}>
                    <AuthorName>{data.get('author')}</AuthorName>
                    <AuthorRating>{repLog10(data.get('author_reputation'))}</AuthorRating>
                </AuthorLink>
                <CategoryLink to={`${currentFeed}?tags=${category}`} aria-label={categoryTooltip}>
                    <CategoryLinkIn>{tt('g.in')}</CategoryLinkIn> {category}
                </CategoryLink>
            </DetailsBlock>
        );
    }

    renderFooter() {
        const { permLink, data } = this.props;
        const { menu, twoLines } = this.state;

        return (
            <Footer>
                <VotePanelCompact contentLink={permLink} splitter={Splitter} />
                <Splitter />
                <ReplyBlock mini count={data.get('children')} link={data.get('url')} />
                {this.renderRepostButton()}
                {twoLines ? null : (
                    <Fragment>
                        <Splitter />
                        {this.renderDetails(true)}
                    </Fragment>
                )}
                <Filler />
                <MenuWrapper>
                    {menu ? <CompactPostCardMenu post={null} onClose={this.onMenuClose} /> : null}
                    <DotsIcon onClick={this.onMenuHandlerClick} />
                </MenuWrapper>
            </Footer>
        );
    }

    render() {
        return (
            <Root>
                {this.renderBody()}
                {this.renderFooter()}
            </Root>
        );
    }
}
