import React, { PureComponent, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import tt from 'counterpart';

import Icon from 'src/app/components/golos-ui/Icon';
import { getImageSrc } from 'src/app/helpers/images';
import { breakWordStyles } from 'src/app/helpers/styles';
import { VotePanelCompact } from 'src/app/components/common/VotePanel';
import { ReplyBlock } from '../../common/ReplyBlock';
import { detransliterate, repLog10 } from 'app/utils/ParsersAndFormatters';

const PREVIEW_WIDTH = 148;
const PREVIEW_HEIGHT = 80;
const PREVIEW_SIZE = `${PREVIEW_WIDTH}x${PREVIEW_HEIGHT}`;

const Root = styled.div`
    padding: 20px 20px 10px;
    margin-bottom: 20px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const Body = styled.div``;

const PostTitle = styled.div`
    margin-bottom: 9px;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.13;
    color: #393636;
    ${breakWordStyles};
`;

const activeStyle = css`
    color: #959595;
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
    letter-spacing: -0.2px;
    color: #393636;
    ${breakWordStyles};
`;

const BodyLink = styled(Link)`
    display: flex;
`;

const PostImage = styled.img`
    width: ${PREVIEW_WIDTH}px;
    height: ${PREVIEW_HEIGHT}px;
    margin-right: 19px;
    border-radius: 6px;
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    min-height: 20px;
`;

const Splitter = styled.div`
    width: 1px;
    height: 20px;
    margin: 0 10px;
    background: #e1e1e1;
`;

const DetailsBlock = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #959595;
    user-select: none;
`;

const DateLink = styled(LinkStyled)`
    padding-right: 3px;
    padding-left: 10px;
`;

const AuthorLink = styled(LinkStyled)`
    padding-left: 3px;
    padding-right: 3px;
    user-select: none;

    &:hover * {
        border-color: #333;
    }
`;

const AuthorName = styled.div`
    display: inline-block;
    font-weight: bold;
    margin-right: 4px;
`;

const AuthorRating = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 18px;
    border: 1px solid #b7b7b9;
    border-radius: 100px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    transition: border-color 0.15s;
`;

const BlogLinkBlock = styled.div`
    display: flex;
    align-items: baseline;
    padding-left: 3px;
`;

const BlogLink = styled(LinkStyled)`
    padding-right: 10px;
    padding-left: 4px;
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
`;

export default class PostCardCompact extends PureComponent {
    onRepostClick = () => {
        this.props.openRepostDialog(this.props.postLink);
    };

    renderBody() {
        const { sanitizedData, stats } = this.props;
        const withImage = sanitizedData.image_link && !stats.gray && !stats.hide;

        return (
            <BodyLink to={sanitizedData.link} onClick={this.props.onClick}>
                {withImage ? (
                    <PostImage
                        alt={tt('aria_label.post_image')}
                        src={getImageSrc(PREVIEW_SIZE, sanitizedData.image_link)}
                    />
                ) : null}
                <Body>
                    <PostTitle>{sanitizedData.title}</PostTitle>
                    <PostContent dangerouslySetInnerHTML={sanitizedData.html} />
                </Body>
            </BodyLink>
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

    renderFooter() {
        const { permLink, data, author } = this.props;

        const category = detransliterate(data.get('category'));
        const categoryTooltip = tt('aria_label.category', { category: category });

        const created = data.get('created');

        if (author) {
            console.log(this.props.author.toJS());
        }

        return (
            <Footer>
                <VotePanelCompact contentLink={permLink} splitter={Splitter} />
                <Splitter />
                <ReplyBlock mini count={data.get('children')} link={data.get('url')} />
                {this.renderRepostButton()}
                <Splitter />
                <DetailsBlock>
                    <DateLink
                        to={data.get('url')}
                        data-tooltip={new Date(created).toLocaleString()}
                    >
                        <FormattedRelative value={created} />
                    </DateLink>
                    <AuthorLink to={`@${data.get('author')}`}>
                        <AuthorName>{data.get('author')}</AuthorName>
                        <AuthorRating>{repLog10(data.get('author_reputation'))}</AuthorRating>
                    </AuthorLink>
                    <BlogLinkBlock>
                        {tt('g.in')}
                        <BlogLink to={`?tags=${category}`} aria-label={categoryTooltip}>
                            {category}
                        </BlogLink>
                    </BlogLinkBlock>
                </DetailsBlock>
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
