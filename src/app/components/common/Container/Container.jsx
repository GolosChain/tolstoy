import styled from 'styled-components';
import is from 'styled-is';
import Flex from 'golos-ui/Flex';

export const MAX_WIDTH = 1150;
export const OFFSET = 20;

const Container = styled(Flex)`
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;

    @media (max-width: ${MAX_WIDTH + OFFSET * 2}px) {
        margin: 0 ${OFFSET}px;

        ${is('usePadding')`
            margin: 0;
            padding: 0 ${OFFSET}px;
        `};
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
