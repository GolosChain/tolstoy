import styled from 'styled-components';
import is from 'styled-is';

import {
  CONTAINER_BASE_MARGIN,
  CONTAINER_MOBILE_MARGIN,
  CONTAINER_MOBILE_WIDTH,
} from 'constants/container';

export default styled.div`
  margin: 0;

  @media (max-width: 890px) {
    margin: ${CONTAINER_BASE_MARGIN}px;
  }

  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    margin: ${CONTAINER_MOBILE_MARGIN}px;

    ${is('noGaps')`
      margin-left: 0;
      margin-right: 0;
    `};
  }
`;
