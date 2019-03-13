import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import is from 'styled-is';

const POPOVER_OFFSET = 14;
const HALF_ARROW_WIDTH = 11;

const Root = styled.div`
  position: absolute;
  top: 60px;
  z-index: 2;

  border-radius: 6px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  animation: fade-in 0.15s;

  ${is('notificationMobile')`
    width: 100%;
    border-radius: 0;
  `};
`;

const Content = styled.div`
  position: relative;
  z-index: 1;

  min-width: 180px;
`;

const Arrow = styled.div`
  position: absolute;

  margin-top: -${HALF_ARROW_WIDTH * 2}px;

  border: ${HALF_ARROW_WIDTH}px solid transparent;
  border-bottom-color: #f5f5f5;
`;

export default class Popover extends PureComponent {
  static propTypes = {
    notificationMobile: PropTypes.bool,
    menuMobile: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    right: this.calcRight(),
  };

  root = createRef();

  componentDidMount() {
    // Отсрочка на timeout для того чтобы не словить click который и открыл это меню.
    this.deferInitTimeout = setTimeout(() => {
      window.addEventListener('mousedown', this.onAwayClick);
      window.addEventListener('click', this.onAwayClick);
      window.addEventListener('resize', this.onResizeLazy);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.deferInitTimeout);
    window.removeEventListener('mousedown', this.onAwayClick);
    window.removeEventListener('click', this.onAwayClick);
    window.removeEventListener('resize', this.onResizeLazy);
    this.onResizeLazy.cancel();
  }

  render() {
    const { children, menuMobile, notificationMobile } = this.props;
    const { right } = this.state;

    let popoverRight = right;
    if (menuMobile || notificationMobile) {
      popoverRight = 0;
    }

    return (
      <Root
        ref={this.root}
        style={{ right: popoverRight }}
        menuMobile={menuMobile}
        notificationMobile={notificationMobile}
      >
        {notificationMobile && (
          <Arrow style={{ right: right + (POPOVER_OFFSET - HALF_ARROW_WIDTH) }} />
        )}
        <Content>{children}</Content>
      </Root>
    );
  }

  onAwayClick = e => {
    const { target } = this.props;

    if (this.root.current && !this.root.current.contains(e.target) && !target.contains(e.target)) {
      this.props.onClose();
    }
  };

  calcRight() {
    const { target } = this.props;

    if (!target) {
      return 0;
    }

    const box = target.getBoundingClientRect();
    return document.body.clientWidth - Math.round(box.left + box.width / 2) - POPOVER_OFFSET;
  }

  onResize = () => {
    const { menuMobile, notificationMobile } = this.props;
    if (menuMobile || notificationMobile) {
      return;
    }

    this.setState({
      right: this.calcRight(),
    });
  };

  onResizeLazy = throttle(this.onResize, 50);
}
