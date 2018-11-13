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

    isMounted = false;
    state = {
        category: '',
        count: 0,
    };

    componentDidMount() {
        this.isMounted = true;
        this.fetchContent();
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    fetchContent() {
        const { getContent, post } = this.props;
        getContent({ author: post.author, permlink: post.permLink })
            .then(content => {
                if (content && this.isMounted) {
                    this.setState({ category: `/${content.category}` });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        const { post } = this.props;
        const { category } = this.state;
        const postLink = `${category}/@${post.author}/${post.permLink}`;
        const postLinkText = `${post.author}/${post.permLink}`;
        return <WhoPostLink to={postLink}>{postLinkText}</WhoPostLink>;
    }
}
