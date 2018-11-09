import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import tt from 'counterpart';

import Flex from 'golos-ui/Flex';
import Button from 'golos-ui/Button';

const QR_SIZES = 58;
const QR_MARGIN = 18;

const Wrapper = styled.div``;

const ImageQR = styled.img`
    width: ${QR_SIZES}px;
    height: ${QR_SIZES}px;
    cursor: pointer;
    margin-right: ${QR_MARGIN}px;
`;

const KeyInfo = styled.div`
    flex: 0;

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

export default class ShowKey extends Component {
    static propTypes = {
        pubkey: PropTypes.string.isRequired,
        authType: PropTypes.string.isRequired,
        accountName: PropTypes.string.isRequired,
        privateKey: PropTypes.object,
        // connect
        showLogin: PropTypes.func.isRequired,
        showQRKey: PropTypes.func.isRequired,
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

    handleToggleShow = () => this.setState({ showPrivate: !this.state.showPrivate });

    handleShowLogin = () => {
        const { showLogin, accountName, authType } = this.props;

        showLogin({ username: accountName, authType });
    };

    handleShowQr = () => {
        const { showQRKey, authType, pubkey } = this.props;
        const { showPrivate, wif } = this.state;

        showQRKey({
            type: authType,
            text: showPrivate ? wif : pubkey,
            isPrivate: showPrivate,
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
        } else if (!['memo', 'owner'].includes(authType)) {
            return (
                <ButtonStyled onClick={this.handleShowLogin}>{tt('g.login_to_show')}</ButtonStyled>
            );
        }

        return null;
    }

    render() {
        const { pubkey } = this.props;
        const { showPrivate, wif } = this.state;

        return (
            <Wrapper>
                <Flex>
                    <ImageQR
                        src={require('src/app/assets/images/qr.png')}
                        onClick={this.handleShowQr}
                    />
                    <KeyInfo>
                        <Key showPrivate={showPrivate}>{showPrivate ? wif : pubkey}</Key>
                        <Hint>{this.renderHint()}</Hint>
                    </KeyInfo>
                </Flex>
                {this.renderButton()}
            </Wrapper>
        );
    }
}
