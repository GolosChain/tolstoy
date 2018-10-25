import React, { Component } from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import Container from 'src/app/components/common/Container/Container';
import LoginForm from './LoginForm';

const HEADER_HEIGHT = 60;
const CONTAINER_WIDTH = 460;
const DESKTOP_FOOTER_HEIGHT = 324;

const Wrapper = styled(Container)`
    position: relative;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: calc(100vh - ${HEADER_HEIGHT}px - ${DESKTOP_FOOTER_HEIGHT}px);

    @media (max-width: 650px) {
        min-height: auto;
    }
`;

const LeftImage = styled.div`
    position: absolute;
    right: calc(50% + ${CONTAINER_WIDTH / 2}px - 10px);
    width: 330px;
    height: 250px;
    background: url('images/login/left.svg') no-repeat center;
    background-size: contain;
    z-index: 1;

    @media (max-width: 650px) {
        display: none;
    }
`;

const RightImage = styled.div`
    position: absolute;
    left: calc(50% + ${CONTAINER_WIDTH / 2}px - 10px);
    width: 285px;
    height: 240px;
    background: url('images/login/right.svg') no-repeat center;
    background-size: contain;

    @media (max-width: 650px) {
        display: none;
    }
`;

const BottomImage = styled.div`
    display: none;
    width: 460px;
    height: calc(460px * 0.41);
    background: url('images/login/bottom.svg') no-repeat center;
    background-size: contain;

    @media (max-width: 650px) {
        display: block;
    }

    @media (max-width: 500px) {
        width: calc(100vw - 20px * 2);
        height: calc((100vw - 20px * 2) * 0.41);
    }
`;

const LoginWrapper = styled(LoginForm)`
    margin: 10px 0;
`;

export class LoginContainer extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.username) {
            browserHistory.push('/welcome');
        }
    }

    render() {
        return (
            <Wrapper>
                <LeftImage />
                <LoginWrapper />
                <RightImage />
                <BottomImage />
            </Wrapper>
        );
    }
}
