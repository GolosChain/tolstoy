import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { browserHistory, withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import tt from 'counterpart';

import { TagLink } from 'golos-ui/Tag';

import { breakWordStyles } from 'src/app/helpers/styles';
import PostHeader from 'src/app/containers/post/postHeader';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';
import PostFormLoader from 'app/components/modules/PostForm/loader';

const Wrapper = styled.article`
    position: relative;
    padding: 40px 0 60px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 576px) {
        padding: 20px 0;
    }
`;

const Preview = styled.div``;

const Body = styled.div`
    margin-top: 5px;
`;

const PostTitle = styled.h1`
    color: #343434;
    font-weight: 500;
    font-size: 2rem;
    line-height: 40px;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    -webkit-font-smoothing: antialiased;
    ${breakWordStyles};

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

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;

    ${TagLink} {
        margin: 10px 10px 0 0;
    }
`;

@withRouter
export class PostContent extends Component {
    static propTypes = {
        togglePin: PropTypes.func.isRequired,
        toggleFavorite: PropTypes.func.isRequired,

        // connect
        url: PropTypes.string.isRequired,
        relapioToken: PropTypes.string,
    };

    state = {
        hideTagsCategory: false,
    };

    headerRef = createRef();

    componentDidMount() {
        const { params } = this.props;

        if (params.action !== 'edit') {
            window.addEventListener('scroll', this.onScrollLazy);
            window.addEventListener('resize', this.onScrollLazy);
            this.onScrollLazy();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollLazy);
        window.removeEventListener('resize', this.onScrollLazy);
        this.onScrollLazy.cancel();
    }

    onScrollLazy = throttle(
        () => {
            const rect = this.headerRef.current.getBoundingClientRect();

            const hideTagsCategory = rect.top - rect.height / 2 >= 0;

            if (this.state.hideTagsCategory !== hideTagsCategory) {
                this.setState({ hideTagsCategory });
            }
        },
        100,
        { leading: false, trailing: true }
    );

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
        const { payout, title, body, pictures, created, tags, category } = this.props;
        const { hideTagsCategory } = this.state;

        return (
            <Preview>
                <Body>
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
                {tags.length ? (
                    <Tags>
                        {tags.map((tag, index) => {
                            if (hideTagsCategory && tag.origin === category.origin) {
                                return null;
                            }

                            return (
                                <TagLink
                                    to={'/trending?tags=' + tag.tag}
                                    key={index}
                                    aria-label={tt('aria_label.tag', { tag: tag.tag })}
                                    category={tag.origin === category.origin}
                                >
                                    {tag.tag}
                                </TagLink>
                            );
                        })}
                    </Tags>
                ) : null}
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
        const { className, url, isAuthor, togglePin, toggleFavorite, params } = this.props;

        return (
            <Wrapper className={className}>
                {this.renderHelmet()}
                <PostHeader
                    forwardRef={this.headerRef}
                    postUrl={url}
                    togglePin={togglePin}
                    toggleFavorite={toggleFavorite}
                />
                {params.action === 'edit' && isAuthor ? this.renderEditor() : this.renderPreview()}
            </Wrapper>
        );
    }
}
