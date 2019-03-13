import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 30vh;
  align-items: center;
  justify-content: center;
`;

export default ({ reason }) => <Wrapper>{reason}</Wrapper>;
