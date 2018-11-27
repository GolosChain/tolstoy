import React, { Component } from 'react';
import { Link } from 'react-router';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import extractContent from 'app/utils/ExtractContent';

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
        postsContent: PropTypes.instanceOf(Map),
    };

    isMounted = false;

    componentDidMount() {
        this.isMounted = true;
        this.fetchContent();
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    async fetchContent() {
        const { post, getContent, postsContent } = this.props;

        if (postsContent.get(`${post.author}/${post.permLink}`)) {
            return;
        }

        try {
            await getContent({ author: post.author, permlink: post.permLink });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { post, postsContent } = this.props;
        const fullPost = postsContent.get(`${post.author}/${post.permLink}`);
        if (fullPost) {
            const postDesc = extractContent(fullPost).desc;
            return <WhoPostLink to={fullPost.get('url')}>{fullPost.get('title') || postDesc}</WhoPostLink>;
        }
        return null;
    }
}
