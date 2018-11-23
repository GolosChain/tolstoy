import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import tt from 'counterpart';

import ComplexInput from 'golos-ui/ComplexInput';
import SplashLoader from 'golos-ui/SplashLoader';
import Icon from 'golos-ui/Icon';

import { APP_DOMAIN, DONATION_FOR } from 'app/client_config';
import { isBadActor } from 'app/utils/ChainValidation';
import transaction from 'app/redux/Transaction';
import { fetchCurrentStateAction } from 'src/app/redux/actions/fetch';
import { showNotification } from 'src/app/redux/actions/ui';
import { parseAmount } from 'src/app/helpers/currency';
import { saveValue, getValue } from 'src/app/helpers/localStorageUtils';

import DialogFrame from 'app/components/dialogs/DialogFrame';
import DialogManager from 'app/components/elements/common/DialogManager';
import AccountNameInput from 'src/app/components/common/AccountNameInput';

const CURRENCY_SAVE_KEY = 'transfer-dialog.default-currency';

const CURRENCIES = {
    GBG: 'GBG',
    GOLOS: 'GOLOS',
};

const DialogFrameStyled = styled(DialogFrame)`
    flex-basis: 616px;

    @media (max-width: 640px) {
        flex-basis: 340px;
    }
`;

const Content = styled.div`
    padding: 5px 30px 14px;
`;

const SubHeader = styled.div`
    margin-bottom: 16px;
    text-align: center;
    font-size: 14px;
    color: #959595;
`;

const Body = styled.div`
    display: flex;
    margin: 0 -10px;

    @media (max-width: 640px) {
        flex-direction: column;
    }
`;

const Column = styled.div`
    width: 288px;
    padding: 0 10px;

    @media (max-width: 640px) {
        width: unset;
    }
`;

const Section = styled.div`
    margin-bottom: 10px;
`;

const Label = styled.div`
    display: flex;
    align-items: center;
    margin: 19px 0 9px;
    font-size: 14px;
`;

const NoteIcon = Icon.extend`
    margin: -10px 6px -10px 0;
    color: #e1e1e1;
`;

const Note = styled.textarea`
    display: block;
    width: 100%;
    height: 120px;
    padding: 7px 11px;
    border: 1px solid #e1e1e1;
    outline: none;
    border-radius: 6px;
    resize: none;
    font-size: 14px;
    box-shadow: none !important;

    @media (max-width: 640px) {
        height: 60px;
    }
`;

const ErrorBlock = styled.div`
    min-height: 25px;
`;

const ErrorLine = styled.div`
    color: #ff4641;
    animation: fade-in 0.15s;
`;

class TransferDialog extends PureComponent {
    static propTypes = {
        type: PropTypes.oneOf(['donate', 'query']),
        toAccountName: PropTypes.string.isRequired,
        donatePostUrl: PropTypes.string,
        showNotification: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        amount: PropTypes.string,
        token: PropTypes.string,
        memo: PropTypes.string,
    };

    constructor(props) {
        super(props);

        let target = '';

        if (props.toAccountName && props.toAccountName !== props.myUser.get('username')) {
            target = props.toAccountName;
        }

        let note = '';

        if (props.type === 'donate' && props.donatePostUrl) {
            this._initialNote = note = tt('dialogs_transfer.post_donation', {
                url: `https://${APP_DOMAIN}${props.donatePostUrl}`,
            });
        }

        if (props.type === 'query' && props.memo) {
            note = props.memo;
        }

        let amount = '';

        if (props.type === 'query' && props.amount) {
            amount = props.amount;
        }

        let currency = getValue(CURRENCY_SAVE_KEY, [CURRENCIES.GBG, CURRENCIES.GOLOS]) || CURRENCIES.GOLOS;

        if (props.type === 'query' && props.token) {
            currency = props.token;
        }

        this.state = {
            target,
            initialTarget: Boolean(target),
            amount,
            currency,
            note,
            amountInFocus: false,
            loader: false,
            disabled: false,
        };
    }

    render() {
        const { myAccount, type, toAccountName } = this.props;
        const {
            target,
            initialTarget,
            amount,
            currency,
            note,
            loader,
            disabled,
            amountInFocus,
        } = this.state;

        const buttons = [
            {
                id: CURRENCIES.GBG,
                title: 'GBG',
            },
            {
                id: CURRENCIES.GOLOS,
                title: tt('token_names.LIQUID_TOKEN'),
            },
        ];

        let currencyKey = null;

        if (currency === CURRENCIES.GOLOS) {
            currencyKey = 'balance';
        } else if (currency === CURRENCIES.GBG) {
            currencyKey = 'sbd_balance';
        }

        const balance = parseFloat(myAccount.get(currencyKey));

        let { value, error } = parseAmount(amount, balance, !amountInFocus);
        if (isBadActor(target)) {
            error = tt('chainvalidation_js.use_caution_sending_to_this_account');
        }

        const allow = target && value > 0 && !error && !loader && !disabled;

        const lockTarget = type === 'donate' && toAccountName;
        const focusTarget = !lockTarget && !initialTarget;

        return (
            <DialogFrameStyled
                title={tt('dialogs_transfer.transfer.title')}
                titleSize={20}
                icon="coins"
                buttons={[
                    {
                        text: tt('g.cancel'),
                        onClick: this._onCloseClick,
                    },
                    {
                        text: tt('dialogs_transfer.transfer.transfer_button'),
                        primary: true,
                        disabled: !allow,
                        onClick: this._onOkClick,
                    },
                ]}
                onCloseClick={this._onCloseClick}
            >
                <Content>
                    <SubHeader>{tt('dialogs_transfer.transfer.tip')}</SubHeader>
                    <Body>
                        <Column>
                            <Section>
                                <Label>{tt('dialogs_transfer.to')}</Label>
                                <AccountNameInput
                                    name="account"
                                    block
                                    autoFocus={focusTarget}
                                    disabled={lockTarget}
                                    placeholder={tt('dialogs_transfer.to_placeholder')}
                                    value={target}
                                    onChange={this._onTargetChange}
                                />
                            </Section>
                            <Section>
                                <Label>{tt('dialogs_transfer.amount')}</Label>
                                <ComplexInput
                                    placeholder={tt('dialogs_transfer.amount_placeholder', {
                                        amount: balance.toFixed(3),
                                    })}
                                    spellCheck="false"
                                    value={amount}
                                    autoFocus={!focusTarget}
                                    activeId={currency}
                                    buttons={buttons}
                                    onChange={this._onAmountChange}
                                    onFocus={this._onAmountFocus}
                                    onBlur={this._onAmountBlur}
                                    onActiveChange={this._onCurrencyChange}
                                />
                            </Section>
                        </Column>
                        <Column>
                            <Section>
                                <Label>
                                    <NoteIcon name="note" /> {tt('dialogs_transfer.transfer.memo')}
                                </Label>
                                <Note
                                    placeholder={tt('dialogs_transfer.transfer.memo_placeholder')}
                                    value={note}
                                    onChange={this._onNoteChange}
                                />
                            </Section>
                        </Column>
                    </Body>
                    <ErrorBlock>{error ? <ErrorLine>{error}</ErrorLine> : null}</ErrorBlock>
                </Content>
                {loader ? <SplashLoader /> : null}
            </DialogFrameStyled>
        );
    }

    confirmClose() {
        const { target, note, amount } = this.state;

        if (target || note.trim() || amount.trim()) {
            DialogManager.dangerConfirm(tt('dialogs_transfer.confirm_dialog_close')).then(y => {
                if (y) {
                    this.props.onClose();
                }
            });

            return false;
        } else {
            return true;
        }
    }

    _onNoteChange = e => {
        this.setState({
            note: e.target.value,
        });
    };

    _onAmountChange = e => {
        this.setState({
            amount: e.target.value.replace(/[^\d .]+/g, '').replace(/,/g, '.'),
        });
    };

    _onAmountFocus = () => {
        this.setState({
            amountInFocus: true,
        });
    };

    _onAmountBlur = () => {
        this.setState({
            amountInFocus: false,
        });
    };

    _onCurrencyChange = currency => {
        this.setState({
            currency,
        });

        saveValue(CURRENCY_SAVE_KEY, currency);
    };

    _onTargetChange = value => {
        this.setState({
            target: value,
        });
    };

    _onCloseClick = () => {
        this.props.onClose();
    };

    _onOkClick = () => {
        const { myUser, type, donatePostUrl } = this.props;
        const { target, amount, currency, note, loader, disabled } = this.state;

        if (loader || disabled) {
            return;
        }

        let memo = note;

        if (type === 'donate' && donatePostUrl) {
            if (note === this._initialNote) {
                memo = `${DONATION_FOR} ${donatePostUrl}`;
            }
        }

        const operation = {
            from: myUser.get('username'),
            to: target,
            amount: parseFloat(amount.replace(/\s+/, '')).toFixed(3) + ' ' + currency,
            memo,
        };

        this.setState({
            loader: true,
        });

        this.props.transfer(operation, err => {
            if (err) {
                this.setState({
                    loader: false,
                    disabled: false,
                });

                const errStr = err.toString();

                if (errStr === 'Missing object (1020200)') {
                    DialogManager.alert(tt('g.account_not_found'));
                } else if (errStr !== 'Canceled') {
                    DialogManager.alert(errStr);
                }
            } else {
                this.setState({
                    loader: false,
                });

                this.props.showNotification(tt('dialogs_transfer.transfer.transfer_success'));
                this.props.onClose();
            }
        });
    };
}

export default connect(
    state => {
        const myUser = state.user.getIn(['current']);
        const myAccount = myUser ? state.global.getIn(['accounts', myUser.get('username')]) : null;

        return {
            myUser,
            myAccount,
        };
    },
    {
        transfer: (operation, callback) => dispatch =>
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'transfer',
                    operation,
                    successCallback() {
                        callback(null);

                        if (location.pathname.endsWith('/transfers')) {
                            dispatch(fetchCurrentStateAction());
                        }
                    },
                    errorCallback(err) {
                        callback(err);
                    },
                })
            ),
        showNotification,
    },
    null,
    { withRef: true }
)(TransferDialog);
