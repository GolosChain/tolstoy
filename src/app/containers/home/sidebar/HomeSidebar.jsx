import React from 'react';
import styled from 'styled-components';

import TagsCard from 'src/app/components/home/sidebar/TagsCard';
import { SINGLE_COLUMN_WIDTH } from 'src/app/constants/container';

const Wrapper = styled.div`
    @media (max-width: ${SINGLE_COLUMN_WIDTH}px) {
        margin: 0 20px;
    }
`;

export default () => (
    <Wrapper>
        <TagsCard />
    </Wrapper>
);
