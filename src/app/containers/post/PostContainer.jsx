import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import by from 'styled-by';

import Container from 'src/app/components/common/Container/Container';
import SidePanel from 'src/app/containers/post/sidePanel';
import PostContent from 'src/app/containers/post/postContent';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import RegistrationPanel from 'src/app/components/post/RegistrationPanel';
import AboutPanel from 'src/app/containers/post/aboutPanel';
import ActivePanel from 'src/app/containers/post/activePanel';
import CommentsContainer from 'src/app/containers/post/commentsContainer';

const PANEL_MARGIN = 20;
const FOOTER_HEIGHT = 403;
const HEADER_HEIGHT = 60;

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

const SidePanelWrapper = styled(SidePanel)`
    position: fixed;

    ${by('fixedOn', {
        center: `
            bottom: calc(50% - ${HEADER_HEIGHT / 2}px);
            transform: translateY(50%);
        `,
        bottom: `
            position: absolute;
            bottom: ${PANEL_MARGIN}px;
            transform: translateY(0);
        `,
    })};
`;

export class PostContainer extends Component {
    state = {
        fixedOn: 'center',
    };

    componentDidMount() {
        this.props.loadUserFollowData(this.props.author);
        this.props.loadFavorites();

        this.scrollScreen();
        window.addEventListener('scroll', this.scrollScreenLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollScreenLazy);
        this.scrollScreenLazy.cancel();
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
        const { fixedOn } = this.state;
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
