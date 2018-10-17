import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Container from 'src/app/components/common/Container';
import Navigation from 'src/app/components/main/Navigation';

const Wrapper = styled.div`
    background-color: #f9f9f9;
`;

const ContainerStyled = styled(Container)`
    padding: 20px 0 40px;
`;

const Content = styled.div`
    flex: 1;
`;

const Sidebar = styled.div`
    width: 262px;
    margin-left: 30px;
`;

export default class HomeContainer extends Component {
    static propTypes = {
        content: PropTypes.node,
        sidebar: PropTypes.node,
    };

    render() {
        const { content, sidebar } = this.props;

        return (
            <Wrapper>
                <Navigation />
                <ContainerStyled>
                    <Content>{content}</Content>
                    <Sidebar>{sidebar}</Sidebar>
                </ContainerStyled>
            </Wrapper>
        );
    }
}
