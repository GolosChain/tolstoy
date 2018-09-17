import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import MarkdownViewer from '../../../../app/components/cards/MarkdownViewer';
import Tag from '../golos-ui/Tag/Tag';
import PostHeader from './PostHeader';
import { connect } from 'react-redux';
import { authorSelector, currentPostSelector } from '../../redux/selectors/post/post';
import { currentUserSelector } from '../../redux/selectors/common';

const Wrapper = styled.section`
    padding: 40px 70px 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .06);
    
    @media (max-width: 576px) {
        padding: 15px 16px;
    }
`;

const Body = styled.div`
    margin-top: 27px;
`;

const PostTitle = styled.h1`
    margin-top: 20px;
    color: #333333;
    font: 34px 'Open Sans', sans-serif;
    font-weight: bold;
    letter-spacing: 0.37px;
    line-height: 41px;
`;

const PostBody = styled.div`
    padding: 12px 0 14px;
    
    p {
        color: #959595;	
        font-family: 'Open Sans', sans-serif;	
        font-size: 18px;	
        letter-spacing: -0.29px;	
        line-height: 26px;
    }
    
    @media (max-width: 576px) {
        font-size: 16px;	
        letter-spacing: -0.26px;	
        line-height: 24px;
    }
`;

const Tags = styled.div`
    margin-top: -10px;
    display: flex;
    flex-wrap: wrap;
    
    & > div {
        margin: 10px 10px 0 0;
    }
`;

class PostContent extends Component {
    static propTypes = {
        username: PropTypes.string,
        post: PropTypes.shape({
            tags: PropTypes.arrayOf(PropTypes.string).isRequired,
            payout: PropTypes.number.isRequired,
            category: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired,
            created: PropTypes.any.isRequired,
            pictures: PropTypes.bool.isRequired,
            jsonMetadata: PropTypes.string,
            author: PropTypes.string.isRequired,
            isFavorite: PropTypes.bool.isRequired,
        }).isRequired,
        author: PropTypes.shape({
            name: PropTypes.string,
            about: PropTypes.string,
            account: PropTypes.string.isRequired,
            isFollow: PropTypes.bool.isRequired,
            followerCount: PropTypes.number.isRequired,
            pinnedPosts: PropTypes.array.isRequired,
            follow: PropTypes.func.isRequired,
            unfollow: PropTypes.func.isRequired,
        }).isRequired,
    };

    static defaultProps = {
        author: {
            isFollow: false,
        },
    };

    render() {
        const { post, username, author, className } = this.props;
        const { tags, payout, data, category, title, body, jsonMetadata, pictures } = post;
        const formId = `postFull-${data}`;
        return (
            <Wrapper className={className}>
                <PostHeader post={post} username={username} author={author} />
                <Body>
                    <Tag category>{category}</Tag>
                    <PostTitle>{title}</PostTitle>
                    <PostBody>
                        <MarkdownViewer
                            formId={formId + '-viewer'}
                            text={body}
                            jsonMetadata={jsonMetadata}
                            large
                            highQualityPost={payout > 10}
                            noImage={!pictures}
                            timeCteated={new Date(post.created)}
                        />
                    </PostBody>
                </Body>
                <Tags>
                    {tags.map((tag, index) => (
                        <Tag category={index === 0} key={index}>
                            {tag}
                        </Tag>
                    ))}
                </Tags>
            </Wrapper>
        );
    }
}

const mapStateToProps = (state, props) => {
    const post = currentPostSelector(state, props);
    return (
        !!post && {
            post,
            username: currentUserSelector(state).get('username'),
            author: authorSelector(state, props),
        }
    );
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostContent);
