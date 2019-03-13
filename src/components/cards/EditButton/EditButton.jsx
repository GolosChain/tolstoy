import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: 30px;
  min-height: 30px;

  color: #aaa;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #333;
  }
`;

const PenIcon = styled(Icon)`
  flex-shrink: 0;
`;

const EditButton = ({ onEditClick }) => (
  <Wrapper data-tooltip={tt('g.edit_comment')} onClick={onEditClick}>
    <PenIcon name="pen" size={20} />
  </Wrapper>
);

EditButton.propTypes = {
  onEditClick: PropTypes.func.isRequired,
};

export default EditButton;
