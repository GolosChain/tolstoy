import React, { PureComponent } from 'react';
import styled from 'styled-components';
import AccountMenu from '../AccountMenu';

const Root = styled.div`
  position: absolute;
  top: 0;
  left: -22px;
  right: -22px;
  padding-top: 60px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  animation: fade-in 0.15s;
`;

const Line = styled.div`
  border-bottom: 1px solid #e1e1e1;
`;

export default class AccountMenuDesktopWrapper extends PureComponent {
  componentDidMount() {
    window.addEventListener('mousedown', this._onAwayClick);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this._onAwayClick);
  }

  render() {
    return (
      <Root ref={this._onRef}>
        <Line />
        <AccountMenu onClose={this._onMenuClose} />
      </Root>
    );
  }

  _onRef = el => {
    this._root = el;
  };

  _onAwayClick = e => {
    if (this._root && !this._root.parentNode.contains(e.target)) {
      this.props.onClose();
    }
  };

  _onMenuClose = () => {
    this.props.onClose();
  };
}
