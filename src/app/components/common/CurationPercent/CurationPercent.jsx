import React from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Text = styled.div`
    margin: 0 -1px 0 10px;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 3px 0;
    font-size: 18px;
    letter-spacing: 1.6px;
    color: #757575;
    user-select: none;
    cursor: default;
`;

const KIcon = styled(Icon).attrs({ name: 'k_round' })`
    width: 20px;
    color: #333;
`;

export default function CurationPercent({ curationPercent, mini, className }) {
    if (curationPercent === null || curationPercent === undefined) {
        return null;
    }

    const hint = tt('curation_percent.curation_rewards_percent');

    return (
        <Wrapper data-tooltip={hint} aria-label={hint} mini={mini} className={className}>
            <KIcon />
            <Text>{curationPercent}%</Text>
        </Wrapper>
    );
}
