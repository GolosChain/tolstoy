import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/Post/SidePanel';
import { authorSelector, currentPostSelector } from '../../redux/selectors/post/post';
import PostContent from '../../components/post/PostContent';
import ActivePanel from './ActivePanel';
import AboutPanel from './AboutPanel';
import { USER_FOLLOW_DATA_LOAD } from '../../redux/constants/followers';
import { FAVORITES_LOAD } from '../../redux/constants/favorites';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
`;

const ContentWrapper = Container.extend`
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

class PostContainer extends Component {
    constructor(props) {
        super(props);
        props.loadUserFollowData(props.account);
        props.loadFavorites();
    }

    render() {
        console.log(window.innerWidth);
        const { postLoaded } = this.props;
        if (!postLoaded) return null;
        return (
            <Wrapper>
                <ContentWrapper>
                    <PostContent />
                    <ActivePanel />
                    <AboutPanel />
                    <SidePanel />
                </ContentWrapper>
            </Wrapper>
        );
    }
}

const mapStateToProps = (state, props) => {
    const post = currentPostSelector(state, props);
    const author = authorSelector(state, props);
    return {
        account: author.account,
        postLoaded: !!post,
    };
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
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostContainer);
