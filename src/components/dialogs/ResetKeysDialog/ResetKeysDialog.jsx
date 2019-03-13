import React, { Component } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';

import DialogFrame from 'components/dialogs/DialogFrame';
import ResetKey from 'components/userProfile/settings/keys/ResetKey';

const DialogFrameStyled = styled(DialogFrame)`
  flex-basis: 580px;
`;

export default class ResetKeysDialog extends Component {
  onClose = () => {
    this.props.onClose();
  };

  render() {
    const { account, user, password } = this.props;
    return (
      <DialogFrameStyled
        title={tt('dialogs_reset_keys.title', { user })}
        titleSize={20}
        onCloseClick={this.onClose}
      >
        <ResetKey account={account} password={password} onCloseClick={this.onClose} />
      </DialogFrameStyled>
    );
  }
}
