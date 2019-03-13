import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  SINGLE_COLUMN_WIDTH,
  CONTAINER_FULL_WIDTH,
  CONTAINER_MOBILE_WIDTH,
  CONTAINER_MOBILE_MARGIN,
} from 'src/constants/container';
import Container from 'src/components/common/Container';
import MainNavigation from 'src/components/main/MainNavigation';
import TagsBox from 'src/components/home/TagsBox';
import RegistrationBanner from 'src/components/home/sidebar/RegistrationBanner';

const Wrapper = styled.div`
  background-color: #f9f9f9;
`;

const ContainerStyled = styled(Container)`
  padding: 22px 0 40px;

  @media (max-width: ${CONTAINER_FULL_WIDTH}px) {
    padding-top: 20px;
  }

  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    padding: ${CONTAINER_MOBILE_MARGIN}px 0;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  @media (max-width: ${SINGLE_COLUMN_WIDTH}px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  flex: 1;
  min-width: 280px;

  @media (max-width: ${SINGLE_COLUMN_WIDTH}px) {
    order: 2;
  }
`;

const Sidebar = styled.div`
  width: 262px;
  margin-left: 30px;

  @media (max-width: ${SINGLE_COLUMN_WIDTH}px) {
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
        <MainNavigation />
        <ContainerStyled>
          <Content>
            <TagsBox />
            {content}
          </Content>
          <Sidebar>
            <RegistrationBanner />
            {sidebar}
          </Sidebar>
        </ContainerStyled>
      </Wrapper>
    );
  }
}
