import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/Post/SidePanel';
import { authorSelector, currentPostSelector } from '../../redux/selectors/post/post';
import PostContent from '../../components/post/PostContent';
import { currentUserSelector } from '../../redux/selectors/common';
import ActivePanel from './ActivePanel';
import transaction from '../../../../app/redux/Transaction';
import AboutPanel from './AboutPanel';
import tt from 'counterpart';
import { USER_FOLLOW_DATA_LOAD, USER_PINNED_POSTS_LOAD } from '../../redux/constants/followers';
import { FAVORITES_LOAD } from '../../redux/constants/favorites';

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
        this._initEvents(props);
        props.loadUserFollowData(props.author.account);
        props.loadFavorites();
    }

    componentDidMount() {
        if (this.props.author.pinnedPostsUrls) {
            this.props.getPostContent(this.props.author.pinnedPostsUrls);
        }
    }

    render() {
        const { post, username, author, accounts } = this.props;
        if (!post) return null;
        author.follow = this.follow;
        author.unfollow = this.unfollow;
        author.ignore = this.ignore;
        author.unignore = this.unignore;
        return (
            <Wrapper>
                <Content>
                    <ContentWrapper post={post} username={username} author={author} />
                    <ActivePanel />
                    <AboutPanel follow={this.follow} unfollow={this.unfollow} />
                    <SidePanel />
                </Content>
            </Wrapper>
        );
    }

    _initEvents = props => {
        const { updateFollow, username, author } = props;
        const upd = type => {
            const done = () => {
                console.log('done');
            };
            updateFollow(username, author.account, type, done);
        };
        this.follow = upd.bind(null, 'blog', tt('g.confirm_follow'));
        this.unfollow = upd.bind(null, null, tt('g.confirm_unfollow'));
        this.ignore = upd.bind(null, 'ignore', tt('g.confirm_ignore'));
        this.unignore = upd.bind(null, null, tt('g.confirm_unignore'));
    };
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
        updateFollow: (follower, following, done) => {
            const json = ['follow', { follower, following, what: ['blog'] }];
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'custom_json',
                    operation: {
                        id: 'follow',
                        required_posting_auths: [follower],
                        json: JSON.stringify(json),
                    },
                    successCallback: done,
                    errorCallback: done,
                })
            );
        },
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
