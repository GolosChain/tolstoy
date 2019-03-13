import React from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

const KIcon = styled(Icon).attrs({ name: 'k_round' })`
  width: 20px;
  color: #333;
`;

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

  ${is('mini')`
    font-size: 16px;
    letter-spacing: 1.4px;

    ${KIcon} {
      width: 17px;
    }
  `};

  ${is('micro')`
    font-size: 12px;
    letter-spacing: normal;
    
    ${KIcon} {
      width: 16px;
      color: #959595;
    }
    
    ${Text} {
      margin-left: 6px;
    }
  `};
`;

export default function CurationPercent({ curationPercent, mini, micro, className }) {
  if (curationPercent === null || curationPercent === undefined) {
    return null;
  }

  const hint = tt('curation_percent.curation_rewards_percent');

  return (
    <Wrapper data-tooltip={hint} aria-label={hint} mini={mini} micro={micro} className={className}>
      <KIcon />
      <Text>{curationPercent}%</Text>
    </Wrapper>
  );
}
