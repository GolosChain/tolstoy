import React, { Component } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import is from 'styled-is';

import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/post/sidePanel';
import PostContent from 'src/app/containers/post/postContent';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import RegistrationPanel from 'src/app/components/post/RegistrationPanel';
import AboutPanel from 'src/app/containers/post/aboutPanel';
import ActivePanel from 'src/app/containers/post/activePanel';
import CommentsContainer from 'src/app/containers/post/commentsContainer';

const PADDING_FROM_HEADER = 22;
const HEADER_HEIGHT = 121;
const FOOTER_HEIGHT = 403;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
`;

const ContentWrapper = styled(Container)`
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 1024px;
    padding-top: 22px;
    padding-bottom: 17px;

    @media (max-width: 576px) {
        margin: 0;
        padding-top: 0;
    }
`;

const Loader = styled(LoadingIndicator)`
    margin-top: 30px;
`;

export class PostContainer extends Component {
    state = {
        hidePanel: false,
        fixedOnScreen: false,
    };

    componentDidMount() {
        this.props.loadUserFollowData(this.props.author);
        this.props.loadFavorites();

        this.resizeScreenLazy();
        window.addEventListener('scroll', this.scrollScreenLazy);
        window.addEventListener('resize', this.resizeScreenLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollScreenLazy);
        window.removeEventListener('resize', this.resizeScreenLazy);
        this.scrollScreenLazy.cancel();
        this.resizeScreenLazy.cancel();
    }

    togglePin = () => {
        const { author, permLink, isPinned, togglePin } = this.props;
        togglePin(author + '/' + permLink, !isPinned);
    };

    toggleFavorite = () => {
        const { author, permLink, isFavorite } = this.props;
        this.props.toggleFavorite(author + '/' + permLink, !isFavorite);
    };

    render() {
        const { postLoaded, isUserAuth } = this.props;
        const { fixedOnScreen, hidePanel } = this.state;
        if (!postLoaded) return <Loader type="circle" center size={40} />;
        return (
            <Wrapper>
                <ContentWrapper>
                    <PostContent togglePin={this.togglePin} toggleFavorite={this.toggleFavorite}/>
                    <ActivePanel togglePin={this.togglePin} toggleFavorite={this.toggleFavorite}/>
                    <AboutPanel />
                    <SidePanel togglePin={this.togglePin} toggleFavorite={this.toggleFavorite}/>
                    <CommentsContainer />
                    {!isUserAuth && <RegistrationPanel />}
                </ContentWrapper>
            </Wrapper>
        );
    }
}
