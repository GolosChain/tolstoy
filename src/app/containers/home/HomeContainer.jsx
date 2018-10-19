import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List } from 'immutable';

import Container from 'src/app/components/common/Container';
import Navigation from 'src/app/components/main/Navigation';
import TagsBox from 'src/app/components/home/TagsBox';

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

        selectedSelectTags: PropTypes.instanceOf(List),
        selectedFilterTags: PropTypes.instanceOf(List),
    };

    render() {
        const { content, sidebar, selectedSelectTags, selectedFilterTags } = this.props;

        return (
            <Wrapper>
                <Navigation />
                <ContainerStyled>
                    <Content>
                        <TagsBox selectedSelectTags={selectedSelectTags} selectedFilterTags={selectedFilterTags} />
                        {content}
                    </Content>
                    <Sidebar>{sidebar}</Sidebar>
                </ContainerStyled>
            </Wrapper>
        );
    }
}
