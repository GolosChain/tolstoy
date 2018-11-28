import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

import { getImageSrc } from 'src/app/helpers/images';
import { breakWordStyles } from 'src/app/helpers/styles';

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

export default class PostCardCompact extends PureComponent {
    onClick = () => {};

    renderBody() {
        const { sanitizedData, stats } = this.props;
        const withImage = sanitizedData.image_link && !stats.gray && !stats.hide;

        return (
            <BodyLink to={sanitizedData.link} onClick={this.onClick}>
                {withImage ? (
                    <PostImage src={getImageSrc(PREVIEW_SIZE, sanitizedData.image_link)} />
                ) : null}
                <Body>
                    <PostTitle>{sanitizedData.title}</PostTitle>
                    <PostContent dangerouslySetInnerHTML={sanitizedData.html} />
                </Body>
            </BodyLink>
        );
    }

    renderFooter() {
        return <Footer>123</Footer>;
    }

    render() {
        console.log('Props', this.props);

        return (
            <Root>
                {this.renderBody()}
                {this.renderFooter()}
            </Root>
        );
    }
}
