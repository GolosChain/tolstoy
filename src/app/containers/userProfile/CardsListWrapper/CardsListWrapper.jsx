import styled from 'styled-components';

import { BASE_MARGIN, MOBILE_MARGIN, MOBILE_WIDTH } from 'src/app/components/common/Container';

export default styled.div`
    margin: 0;

    @media (max-width: 890px) {
        margin: ${BASE_MARGIN}px;
    }

    @media (max-width: ${MOBILE_WIDTH}px) {
        margin: ${MOBILE_MARGIN}px;
    }
`;
