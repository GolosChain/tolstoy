import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/Post/SidePanel';
import { currentPostIsFavorite, currentPostSelector } from '../../redux/selectors/post/post';
import PostContent from '../../components/post/PostContent';
import { currentUserSelector } from '../../redux/selectors/common';
import { toggleFavoriteAction } from '../../redux/actions/favorites';
import ActivePanel from './ActivePanel';
import transaction from '../../../../app/redux/Transaction';
const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
`;
const Content = Container.extend`
    padding-top: 22px;
    padding-bottom: 17px;
    display: flex;
    flex-direction: column;
`;
const ContentWrapper = styled(PostContent)``;
const AboutPanel = styled.div``;

class PostContainer extends Component {
    render() {
        const { post, user, isFavorite, isFollow } = this.props;
        return (
            <Wrapper>
                <Content>
                    <ContentWrapper
                        post={post}
                        userName={user.get('username')}
                        isFavorite={isFavorite}
                        onFavoriteClick={this._onFavoriteClick}
                        isFollow={isFollow}
                        changeFollow={this._changeFollow}
                    />
                    <ActivePanel
                        post={post}
                        userName={user.get('username')}
                        onVoteChange={this._onVoteChange}
                    />
                    <AboutPanel />
                    <SidePanel post={post} />
                </Content>
            </Wrapper>
        );
    }

    _onFavoriteClick = () => {
        const { isFavorite, post } = this.props;

        this.props.toggleFavorite(post.get('author') + '/' + post.get('permlink'), !isFavorite);
    };

    _onVoteChange = async percent => {};


    _changeFollow = () => {
        const { updateFollow, user, post } = this.props;
        const follower = user.get('username');
        const following = post.get('author');
        const done = () => {
            console.log('done');
        };
        updateFollow(follower, following, done);
    };
}

const mapStateToProps = (state, props) => {
    return {
        post: currentPostSelector(state, props),
        user: currentUserSelector(state),
        isFavorite: currentPostIsFavorite(state, props),
        isFollow: true,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        toggleFavorite: (link, isAdd) => {
            dispatch(toggleFavoriteAction({ link, isAdd }));
        },
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostContainer);
