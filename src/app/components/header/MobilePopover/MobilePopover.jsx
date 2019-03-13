import React, { PureComponent } from 'react';
import throttle from 'lodash/throttle';
import styled from 'styled-components';

const Root = styled.div`
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1;
  box-shadow: 0 7px 13px 0 rgba(0, 0, 0, 0.05);
  animation: from-up 0.15s;
`;

const Shadow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  overflow: hidden;

  &:after {
    position: absolute;
    content: '';
    top: 0;
    left: -20px;
    right: -20px;
    height: 40px;
    box-shadow: inset 0 0 18px 4px rgba(0, 0, 0, 0.05);
  }
`;

const Arrow = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  margin-top: -18px;
  margin-left: -9px;
  border: 9px solid transparent;
  border-bottom-color: #f5f5f5;
  transform: translateX(${({ left }) => left}px);
`;

export default class MobilePopover extends PureComponent {
  state = {
    left: this._calcLeft(),
  };

  componentDidMount() {
    window.addEventListener('mousedown', this._onAwayClick);
    window.addEventListener('click', this._onAwayClick);
    window.addEventListener('resize', this._onResizeLazy);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this._onAwayClick);
    window.removeEventListener('click', this._onAwayClick);
    window.removeEventListener('resize', this._onResizeLazy);
    this._onResizeLazy.cancel();
  }

  render() {
    const { children } = this.props;
    const { left } = this.state;

    return (
      <Root ref={this._onRef}>
        <Shadow />
        {left == null ? null : <Arrow left={left} />}
        {children}
      </Root>
    );
  }

  _onRef = el => {
    this._root = el;
  };

  _onAwayClick = e => {
    const { target } = this.props;

    if (this._root && !this._root.contains(e.target) && !target.contains(e.target)) {
      this.props.onClose();
    }
  };

  _calcLeft() {
    const { target } = this.props;

    if (!target) {
      return null;
    }

    const box = target.getBoundingClientRect();

    if (box.width === 0) {
      return null;
    }

    return Math.round(box.left + box.width / 2);
  }

  _onResize = () => {
    this.setState({
      left: this._calcLeft(),
    });
  };

  _onResizeLazy = throttle(this._onResize, 50);
}
