import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const WhoPostLink = styled(Link)`
    display: block;
    color: #333;
    white-space: nowrap;
    text-decoration: underline;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export default class PostLink extends Component {
    static propTypes = {
        post: PropTypes.shape({
           author: PropTypes.string.isRequired,
           permLink: PropTypes.string.isRequired,
        }),
        getContent: PropTypes.func.isRequired,
    };

    state = {
        category: '',
    };

    componentDidMount() {
        this.fetchContent();
    }

    fetchContent() {
        const { getContent, post } = this.props;
        getContent({ author: post.author, permlink: post.permLink }).then(content => {
            if (content) {
                this.setState({ category: content.category });
            }
        });
    }

    render() {
        const { category } = this.state;
        const { post } = this.props;
        const postLink = `/${category}/@${post.author}/${post.permLink}`;
        const postLinkText = `${post.author}/${post.permLink}`;
        return (
            <WhoPostLink to={postLink}>
                {postLinkText}
            </WhoPostLink>
        );
    }
}
