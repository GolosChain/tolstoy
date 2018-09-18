import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/Post/SidePanel';
import { authorSelector, currentPostSelector } from '../../redux/selectors/post/post';
import PostContent from '../../components/post/PostContent';
import { currentUserSelector } from '../../redux/selectors/common';
import ActivePanel from './ActivePanel';
import AboutPanel from './AboutPanel';
import { USER_FOLLOW_DATA_LOAD } from '../../redux/constants/followers';
import { FAVORITES_LOAD } from '../../redux/constants/favorites';
import { USER_PINNED_POSTS_LOAD } from '../../redux/constants/pinnedPosts';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
`;

const Content = Container.extend`
    position: relative;
    padding-top: 22px;
    padding-bottom: 17px;
    display: flex;
    flex-direction: column;

    @media (max-width: 576px) {
        margin: 0;
        padding-top: 0;
    }
`;

const ContentWrapper = styled(PostContent)``;

class PostContainer extends Component {
    constructor(props) {
        super(props);
        props.loadUserFollowData(props.author.account);
        props.loadFavorites();
    }

    componentDidMount() {
        if (this.props.author.pinnedPostsUrls) {
            this.props.getPostContent(this.props.author.pinnedPostsUrls);
        }
    }

    render() {
        const { post, username, author } = this.props;
        if (!post) return null;
        return (
            <Wrapper>
                <Content>
                    <ContentWrapper post={post} username={username} author={author} />
                    <ActivePanel />
                    <AboutPanel />
                    <SidePanel />
                </Content>
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
    return {
        loadUserFollowData: username => {
            dispatch({
                type: USER_FOLLOW_DATA_LOAD,
                payload: {
                    username,
                },
            });
        },
        loadFavorites: () => {
            dispatch({
                type: FAVORITES_LOAD,
                payload: {},
            });
        },
        getPostContent: urls => {
            dispatch({
                type: USER_PINNED_POSTS_LOAD,
                payload: {
                    urls,
                },
            });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostContainer);
