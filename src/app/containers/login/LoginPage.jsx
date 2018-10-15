import React, { Component } from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import Container from 'src/app/components/common/Container/Container';
import Login from 'src/app/containers/login';

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 324;

const Wrapper = styled(Container)`
    margin: 10px auto;
    align-items: center;
    justify-content: center;

    min-height: calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px);
`;

export class LoginPage extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentUser) {
            browserHistory.push('/welcome');
        }
    }

    render() {
        return (
            <Wrapper>
                <Login />
            </Wrapper>
        );
    }
}
