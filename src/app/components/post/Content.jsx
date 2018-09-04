import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div``;
const Header = styled.div``;

const PostWrapper = styled.div``;
const PostTitle = styled.div``;

const PostBody = styled.div``;
const TagsWrapper = styled.div``;

class Content extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
    };

    render() {
        const { className, post } = this.props;
        console.log(post);
        return (
            <Wrapper className={className}>
                <Header />
                <PostWrapper>
                    <PostTitle>{post.get('title')}</PostTitle>
                    <PostBody>{post.get('body')}</PostBody>
                </PostWrapper>
                <TagsWrapper />
            </Wrapper>
        );
    }
}

export default Content;
