import React from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import Icon from 'components/golos-ui/Icon';

const ToggleCommentOpen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  min-height: 30px;
  user-select: none;
  cursor: pointer;
  transform: rotate(0);
  transition: transform 0.25s;

  ${is('collapsed')`
    color: #b7b7ba;
    transform: rotate(0.5turn);
  `};
`;

const ChevronIcon = styled(Icon)`
  flex-shrink: 0;
`;

const CloseOpenButton = ({ collapsed, toggle, className }) => (
  <ToggleCommentOpen
    data-tooltip={collapsed ? tt('g.uncollapse') : tt('g.collapse')}
    aria-label={collapsed ? tt('g.uncollapse') : tt('g.collapse')}
    className={className}
    collapsed={collapsed ? 1 : 0}
    onClick={toggle}
  >
    <ChevronIcon name="chevron" width="12" height="7" />
  </ToggleCommentOpen>
);

CloseOpenButton.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default CloseOpenButton;
