import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'mocks/react-router';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Root = styled.div``;

const Action = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  box-sizing: content-box;
  border-bottom: 1px solid #e9e9e9;
  font-size: 12px;
  font-weight: 500;
  color: #393636;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  user-select: none;
  transition: color 0.15s;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #000;
  }
`;

const LinkAction = styled(Link)`
  display: block;
  border-bottom: 1px solid #e9e9e9;
`;

const ActionIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  flex-shrink: 0;
`;

const ActionTitle = styled.div`
  letter-spacing: 0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default class RightActions extends PureComponent {
  render() {
    const { isOwner } = this.props;

    return (
      <Root>
        {isOwner ? (
          <LinkAction to="/market">
            <Action>
              <ActionIcon name="wallet" />
              <ActionTitle>{tt('user_profile.actions.buy_or_sell')}</ActionTitle>
            </Action>
          </LinkAction>
        ) : null}
        <Action onClick={this._onTransferClick}>
          <ActionIcon name="coins" />
          <ActionTitle>{tt('user_profile.actions.transfer')}</ActionTitle>
        </Action>
        {isOwner ? (
          <Action onClick={this._onSafeClick}>
            <ActionIcon name="locked" />
            <ActionTitle>{tt('user_profile.actions.transfer_to_savings')}</ActionTitle>
          </Action>
        ) : null}
        <Action onClick={this._onDelegateClick}>
          <ActionIcon name="voice" />
          <ActionTitle>{tt('user_profile.actions.delegate_vesting_shares')}</ActionTitle>
        </Action>
        {isOwner ? (
          <Action onClick={this._onConvertClick}>
            <ActionIcon name="refresh" />
            <ActionTitle>{tt('user_profile.actions.convert')}</ActionTitle>
          </Action>
        ) : null}
      </Root>
    );
  }

  _onTransferClick = () => {
    this.props.openTransferDialog(this.props.pageAccountName);
  };

  _onSafeClick = () => {
    this.props.openSafeDialog();
  };

  _onConvertClick = () => {
    this.props.openConvertDialog();
  };

  _onDelegateClick = () => {
    this.props.openDelegateVestingDialog(this.props.pageAccountName);
  };
}
