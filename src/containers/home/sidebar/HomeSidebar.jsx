import React from 'react';
import styled from 'styled-components';

import TagsCard from 'components/home/sidebar/TagsCard';
import { CONTAINER_MOBILE_WIDTH } from 'constants/container';

const Wrapper = styled.div`
  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    margin: 0 16px;
  }
`;

export default () => (
  <Wrapper>
    <TagsCard />
  </Wrapper>
);
