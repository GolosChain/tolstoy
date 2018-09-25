import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/post/SidePanel';
import PostContent from 'src/app/components/post/PostContent';
import ActivePanel from 'src/app/containers/post/ActivePanel';
import AboutPanel from 'src/app/containers/post/AboutPanel';
import { USER_FOLLOW_DATA_LOAD } from 'src/app/redux/constants/followers';
import { FAVORITES_LOAD } from 'src/app/redux/constants/favorites';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commanPost';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
`;

const ContentWrapper = styled(Container)`
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

@connect(
    (state, props) => {
        const post = currentPostSelector(state, props);
        const author = authorSelector(state, props);
        return {
            account: author.account,
            postLoaded: !!post,
        };
    },
    {
        loadUserFollowData: username => ({
            type: USER_FOLLOW_DATA_LOAD,
            payload: {
                username,
            },
        }),
        loadFavorites: () => ({
            type: FAVORITES_LOAD,
            payload: {},
        }),
    }
)
export default class PostContainer extends Component {
    componentDidMount() {
        this.props.loadUserFollowData(this.props.account);
        this.props.loadFavorites();
    }

    render() {
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
