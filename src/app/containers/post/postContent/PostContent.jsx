import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

import PostHeader from 'src/app/containers/post/postHeader';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';
import PostFormLoader from 'app/components/modules/PostForm/loader';

const Wrapper = styled.article`
    position: relative;
    padding: 40px 70px 60px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 576px) {
        padding: 20px;
    }
`;

const Preview = styled.div``;

const Body = styled.div`
    margin-top: 27px;
`;

const PostTitle = styled.h1`
    margin-top: 20px;
    color: #343434;
    font-weight: 500;
    font-size: 2rem;
    line-height: 40px;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    -webkit-font-smoothing: antialiased;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;

    @media (max-width: 576px) {
        font-size: 30px;
    }
`;

const PostBody = styled.div`
    padding-top: 12px;

    p,
    li {
        font-weight: 400;
        font-size: 1rem;
        line-height: 1.56;
        color: #333;
    }

    @media (max-width: 576px) {
        font-size: 1rem;
        letter-spacing: -0.26px;
        line-height: 24px;
    }
`;

const BodyHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const PromotedMark = styled.div`
    position: relative;
    display: flex;
    &::after {
        content: '';
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -40%);
        z-index: 1;
        width: 14px;
        height: 17px;
        box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.4);
    }
`;

const PromotedIcon = styled(Icon)`
    position: relative;
    z-index: 2;
    min-width: 34px;
    min-height: 37px;
`;

export class PostContent extends Component {
    static propTypes = {
        togglePin: PropTypes.func.isRequired,
        toggleFavorite: PropTypes.func.isRequired,

        // connect
        url: PropTypes.string.isRequired,
        relapioToken: PropTypes.string,
    };

    onEditFinish = () => {
        const { url } = this.props;

        browserHistory.push(url);
    };

    renderHelmet() {
        const { title, relapioToken } = this.props;

        return (
            <Helmet title={tt('meta.title.common.post', { title })}>
                <script
                    type="text/javascript"
                    async
                    src={`https://relap.io/api/v6/head.js?token=${relapioToken}`}
                />
            </Helmet>
        );
    }

    renderPreview() {
        const { payout, title, body, pictures, created, isPromoted } = this.props;

        return (
            <Preview>
                <Body>
                    <BodyHeaderWrapper>
                        {isPromoted && (
                            <PromotedMark>
                                <PromotedIcon name="best" width="34" height="37" />
                            </PromotedMark>
                        )}
                    </BodyHeaderWrapper>
                    <PostTitle>{title}</PostTitle>
                    <PostBody>
                        <MarkdownViewer
                            text={body}
                            large
                            highQualityPost={payout > 10}
                            noImage={!pictures}
                            timeCteated={new Date(created)}
                        />
                    </PostBody>
                </Body>
            </Preview>
        );
    }

    renderEditor() {
        const { author, permLink } = this.props;

        return (
            <PostFormLoader
                editMode
                author={author}
                permLink={permLink}
                onSuccess={this.onEditFinish}
                onCancel={this.onEditFinish}
            />
        );
    }

    render() {
        const { className, url, isAuthor, togglePin, toggleFavorite, action } = this.props;

        return (
            <Wrapper className={className}>
                {this.renderHelmet()}
                <PostHeader postUrl={url} togglePin={togglePin} toggleFavorite={toggleFavorite} />
                {action === 'edit' && isAuthor ? this.renderEditor() : this.renderPreview()}
            </Wrapper>
        );
    }
}
