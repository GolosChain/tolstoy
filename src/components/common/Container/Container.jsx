import styled from 'styled-components';
import is from 'styled-is';
import Flex from 'components/golos-ui/Flex';

import {
  CONTAINER_MAX_WIDTH,
  CONTAINER_MOBILE_WIDTH,
  CONTAINER_BASE_MARGIN,
  CONTAINER_FULL_WIDTH,
  CONTAINER_MOBILE_MARGIN,
} from 'constants/container';

const Container = styled(Flex)`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0 auto;

  @media (max-width: ${CONTAINER_FULL_WIDTH}px) {
    margin-left: ${CONTAINER_BASE_MARGIN}px;
    margin-right: ${CONTAINER_BASE_MARGIN}px;
  }

  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    margin-left: ${CONTAINER_MOBILE_MARGIN}px;
    margin-right: ${CONTAINER_MOBILE_MARGIN}px;
  }

  ${is('small')`
    @media (max-width: 890px) {
      margin: 0 auto;
      flex-direction: column;
      align-items: normal;
    }
  `};
`;
Container.defaultProps = {
  auto: true,
};

export default Container;
