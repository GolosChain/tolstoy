import React, { PureComponent } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  padding-top: 16px;
  margin: 0 0 40px;
  border-bottom: 1px solid #e1e1e1;
`;

const Item = styled.div`
  padding: 3px 3px 10px;
  margin-right: 30px;
  margin-bottom: -1px;
  border-bottom: 4px solid transparent;
  white-space: nowrap;
  letter-spacing: 1.4px;
  color: #b7b7b9;
  font-size: 18px;
  transition: color 0.1s;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: #000;
  }

  ${is('isActive')`
    font-weight: 500;
    color: #000;
    border-bottom-color: #0078C4;
    cursor: default;
  `};
`;

const Filler = styled.i`
  flex-grow: 1;
`;

export default class EditorSwitcher extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    activeId: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { items, activeId } = this.props;

    return (
      <Wrapper>
        {items.map(item => (
          <Item
            key={item.id}
            isActive={item.id === activeId}
            onClick={item.id === activeId ? null : () => this.props.onChange(item.id)}
          >
            {item.text}
          </Item>
        ))}
        <Filler />
      </Wrapper>
    );
  }
}
