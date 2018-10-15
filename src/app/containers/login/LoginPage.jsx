import React, { Component } from 'react';
import styled from 'styled-components';

import Container from 'src/app/components/common/Container/Container';
import {Login} from 'src/app/containers/login/Login';

const Wrapper = styled(Container)`
`;


export class LoginPage extends Component {

    render() {
        return (
            <Wrapper className={className}>
                <Login />
            </Wrapper>
        );
    }
}
