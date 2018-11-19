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
        title: '',
    };

    componentDidMount() {
        this.isMounted = true;
        this.fetchContent();
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        const { post } = this.props;
        if (`${post.author}/${post.permLink}` !== `${nextProps.post.author}/${nextProps.post.permLink}`) {
            this.fetchContent(nextProps.post);
        }
    }

    async fetchContent(relevantPost) {
        const { getContent, post } = this.props;

        let author = post.author;
        let permLink = post.permLink;
        if (relevantPost) {
            author = relevantPost.author;
            permLink = relevantPost.permLink;
        }

        try {
            const content = await getContent({ author: author, permlink: permLink });

            if (content && this.isMounted) {
                this.setState({ category: `/${content.category}`, title: content.title });
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { post } = this.props;
        const { category, title } = this.state;
        const postLink = `${category}/@${post.author}/${post.permLink}`;
        return <WhoPostLink to={postLink}>{title}</WhoPostLink>;
    }
}
