import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/Post/SidePanel';
import { currentPostIsFavorite, currentPostSelector } from '../../redux/selectors/post/post';
import PostContent from '../../components/post/PostContent';
import { currentUserSelector } from '../../redux/selectors/common';
import { toggleFavoriteAction } from '../../redux/actions/favorites';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
`;
const Content = Container.extend`
    padding-top: 22px;
    padding-bottom: 17px;
`;
const ContentWrapper = styled(PostContent)``;
const ActivePanel = styled.div``;
const AboutPanel = styled.div``;
const SidePanelWrapper = styled(SidePanel)`
    position: fixed;
    bottom: 30px;
    left: calc(50% - 684px);

    @media (max-width: 1407px) {
        display: none;
    }
`;

class PostContainer extends Component {
    render() {
        const { post, user, isFavorite } = this.props;
        return (
            <Wrapper>
                <Content>
                    <ContentWrapper
                        post={post}
                        userName={user.get('username')}
                        isFavorite={isFavorite}
                        onFavoriteClick={this._onFavoriteClick}
                    />
                    <ActivePanel />
                    <AboutPanel />
                    <SidePanelWrapper post={post}/>
                </Content>
            </Wrapper>
        );
    }

    _onFavoriteClick = () => {
        const { isFavorite, post } = this.props;

        this.props.toggleFavorite(post.get('author') + '/' + post.get('permlink'), !isFavorite);
    };
}

const mapStateToProps = (state, props) => {
    return {
        post: currentPostSelector(state, props),
        user: currentUserSelector(state),
        isFavorite: currentPostIsFavorite(state, props),
    };
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        toggleFavorite: (link, isAdd) => {
            dispatch(toggleFavoriteAction({ link, isAdd }));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostContainer);
