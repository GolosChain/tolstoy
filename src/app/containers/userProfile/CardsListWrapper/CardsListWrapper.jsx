import styled from 'styled-components';

import {
    CONTAINER_BASE_MARGIN,
    CONTAINER_MOBILE_MARGIN,
    CONTAINER_MOBILE_WIDTH,
} from 'src/app/constants/container';

export default styled.div`
    margin: 0;

    @media (max-width: 890px) {
        margin: ${CONTAINER_BASE_MARGIN}px;
    }

    @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
        margin: ${({ noGaps }) => (noGaps ? 0 : CONTAINER_MOBILE_MARGIN)}px;
    }
`;
