import React, { PureComponent, createRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Menu = styled.div`
  position: fixed;
  margin-top: -8px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  transform: translateX(-50%);
  animation: fade-in 0.25s;
  z-index: 100;
`;

const List = styled.ul`
  padding: 8px 0 7px;
  margin: 0;
`;

const Item = styled.li`
  padding: 8px 16px;
  list-style: none;
  text-align: center;
  color: #393636;
  cursor: pointer;

  &:hover {
    color: #2879ff;
  }

  ${is('active')`
        color: #2879ff;
    `};

  @media (max-width: 500px) {
    padding: 15px 20px;
  }
`;

const ItemIcon = styled(Icon)`
  display: block;
  width: 16px;
  height: 16px;
`;

export default class LayoutSwitcherMenu extends PureComponent {
  root = createRef();

  onItemClick = (layout, isActive) => {
    if (!isActive) {
      this.props.onChange(layout);
    }
    this.props.onClose();
  };

  componentDidMount() {
    // Отсрочка на timeout для того чтобы не словить click который и открыл это меню.
    setTimeout(() => {
      window.addEventListener('click', this.onAwayClick);
      window.addEventListener('scroll', this.onScroll);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onAwayClick);
    window.removeEventListener('scroll', this.onScroll);
  }

  onAwayClick = e => {
    if (!this.root.current.contains(e.target)) {
      this.props.onClose();
    }
  };

  onScroll = () => {
    this.props.onClose();
  };

  render() {
    const { layouts, target, activeLayout } = this.props;
    const box = target.getBoundingClientRect();

    return createPortal(
      <Menu
        style={{
          top: Math.round(box.top),
          left: Math.round(box.left + box.width / 2),
        }}
        ref={this.root}
      >
        <List>
          {layouts.map(layoutName => {
            const isActive = activeLayout === layoutName;
            return (
              <Item
                key={layoutName}
                data-tooltip={tt(`layout_switcher.tooltip.${layoutName}`)}
                aria-label={tt(`layout_switcher.tooltip.${layoutName}`)}
                active={isActive}
                onClick={() => this.onItemClick(layoutName, isActive)}
              >
                <ItemIcon name={`layout_${layoutName}`} />
              </Item>
            );
          })}
        </List>
      </Menu>,
      document.getElementById('content')
    );
  }
}
