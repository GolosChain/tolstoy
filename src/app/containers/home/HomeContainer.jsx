import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Container from 'src/app/components/common/Container';
import Navigation from 'src/app/components/main/Navigation';
import TagsBox from 'src/app/components/home/TagsBox';

const Wrapper = styled.div`
    background-color: #f9f9f9;
`;

const ContainerStyled = styled(Container)`
    padding: 20px 0 40px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Content = styled.div`
    flex: 1;

    @media (max-width: 768px) {
        order: 2;
    }
`;

const Sidebar = styled.div`
    width: 262px;
    margin-left: 30px;

    @media (max-width: 768px) {
        width: auto;
        margin-left: 0;
        order: 1;
    }
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
                    <Content>
                        <TagsBox />
                        {content}
                    </Content>
                    <Sidebar>{sidebar}</Sidebar>
                </ContainerStyled>
            </Wrapper>
        );
    }
}
