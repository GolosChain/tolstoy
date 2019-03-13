import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import tt from 'counterpart';

import Flex from 'golos-ui/Flex';
import Button from 'golos-ui/Button';
import DialogManager from 'components/elements/common/DialogManager';
import QrKeyView from 'components/elements/QrKeyView';

const QR_SIZES = 58;
const QR_MARGIN = 18;

const Wrapper = styled.div``;

const ImageQR = styled.img`
  flex: 0;
  width: ${QR_SIZES}px;
  height: ${QR_SIZES}px;
  cursor: pointer;
  margin-right: ${QR_MARGIN}px;
`;

const KeyInfo = styled.div`
  flex: 1 0;

  @media (max-width: 620px) {
    max-width: calc(100% - ${QR_SIZES + QR_MARGIN}px);
  }
`;

const Key = styled.div`
  color: #393636;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  overflow-wrap: break-word;
  word-wrap: break-word;

  &:hover {
    background: #faebd7;
  }

  ${is('showPrivate')`
        color: #2879ff;

        &:hover {
            background: #d7e2fa;
        }
    `};
`;

const Hint = styled.div`
  color: #959595;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  line-height: 19px;
  margin-top: 12px;
`;

const ButtonStyled = styled(Button)`
  max-width: 100%;
  margin-top: 25px;
  white-space: normal;
`;

const ButtonsWrapper = styled.div`
  display: flex;

  & ${ButtonStyled}:first-child {
    margin-right: 10px;
  }

  @media (max-width: 500px) {
    flex-direction: column;

    & ${ButtonStyled}:first-child {
      margin-right: 0;
    }
  }
`;

export default class ShowKey extends Component {
  static propTypes = {
    pubkey: PropTypes.string.isRequired,
    authType: PropTypes.string.isRequired,
    accountName: PropTypes.string.isRequired,
    privateKey: PropTypes.object,
    // connect
    showLogin: PropTypes.func.isRequired,
  };

  state = {
    wif: null,
  };

  componentWillMount() {
    this.setWif(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setWif(nextProps);
  }

  setWif(props) {
    const { privateKey, pubkey } = props;

    if (privateKey && pubkey === privateKey.toPublicKey().toString()) {
      this.setState({ wif: privateKey.toWif() });
    } else {
      this.setState({ wif: null });
    }
  }

  handleToggleShow = () => {
    this.setState({
      showPrivate: !this.state.showPrivate,
    });
  };

  handleShowLogin = () => {
    const { accountName, authType } = this.props;

    this.props.showLogin({
      username: accountName,
      authType,
      onClose: username => {
        if (username) {
          this.setState({
            showPrivate: true,
          });
        }
      },
    });
  };

  handleShowQr = () => {
    const { authType, pubkey } = this.props;
    const { showPrivate, wif } = this.state;

    DialogManager.showDialog({
      component: QrKeyView,
      props: {
        type: authType,
        text: showPrivate ? wif : pubkey,
        isPrivate: showPrivate,
      },
    });
  };

  renderHint() {
    const { authType } = this.props;

    if (authType === 'posting') {
      return tt('userkeys_jsx.posting_key_is_required_it_should_be_different');
    } else if (authType === 'active') {
      return tt('userkeys_jsx.the_active_key_is_used_to_make_transfers_and_place_orders');
    } else if (authType === 'owner') {
      return (
        <Fragment>
          {tt('userkeys_jsx.the_owner_key_is_required_to_change_other_keys')}
          <br />
          {tt('userkeys_jsx.the_private_key_or_password_should_be_kept_offline')}
        </Fragment>
      );
    } else if (authType === 'memo') {
      return tt('userkeys_jsx.the_memo_key_is_used_to_create_and_read_memos');
    }

    return null;
  }

  renderButton() {
    const { authType } = this.props;
    const { showPrivate, wif } = this.state;

    if (wif) {
      return (
        <ButtonStyled onClick={this.handleToggleShow} light={showPrivate}>
          {showPrivate ? tt('g.hide_private_key') : tt('g.show_private_key')}
        </ButtonStyled>
      );
    } else if (authType !== 'memo' && authType !== 'owner') {
      return <ButtonStyled onClick={this.handleShowLogin}>{tt('g.auth_to_show')}</ButtonStyled>;
    }

    return null;
  }

  renderQRButton() {
    return <ButtonStyled onClick={this.handleShowQr}>{tt('g.show')} QR</ButtonStyled>;
  }

  render() {
    const { pubkey } = this.props;
    const { showPrivate, wif } = this.state;

    return (
      <Wrapper>
        <Flex>
          <KeyInfo>
            <Key showPrivate={showPrivate}>{showPrivate ? wif : pubkey}</Key>
            <Hint>{this.renderHint()}</Hint>
          </KeyInfo>
        </Flex>
        <ButtonsWrapper>
          {this.renderButton()}
          {this.renderQRButton()}
        </ButtonsWrapper>
      </Wrapper>
    );
  }
}
