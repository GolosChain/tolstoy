import React from 'react';
import styled from 'styled-components';

import TagsCard from 'src/app/components/home/sidebar/TagsCard';
import VotingCTA from 'src/app/components/home/sidebar/VotingCTA';
import { CONTAINER_MOBILE_WIDTH } from 'src/app/constants/container';

const Wrapper = styled.div`
    @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
        margin: 0 16px;
    }
`;

export default () => (
    <Wrapper>
        <VotingCTA />
        <TagsCard />
    </Wrapper>
);
