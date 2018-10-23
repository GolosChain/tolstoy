import styled from 'styled-components';
import is from 'styled-is';
import Flex from 'golos-ui/Flex';

const Container = styled(Flex)`
    max-width: 1150px;
    margin: 0 auto;

    @media (max-width: 1190px) {
        margin: 0 20px;
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
