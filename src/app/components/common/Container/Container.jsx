import styled from 'styled-components';
import is from 'styled-is';
import Flex from 'golos-ui/Flex';

export const CONTAINER_MAX_WIDTH = 1150;
export const CONTAINER_MOBILE_WIDTH = 500;
export const CONTAINER_BASE_MARGIN = 20;
export const CONTAINER_FULL_WIDTH = CONTAINER_MAX_WIDTH + 2 * CONTAINER_BASE_MARGIN;
export const CONTAINER_MOBILE_MARGIN = 16;

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
