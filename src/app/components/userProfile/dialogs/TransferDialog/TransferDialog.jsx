import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import tt from 'counterpart';
import transaction from 'app/redux/Transaction';
import DialogFrame from 'app/components/dialogs/DialogFrame';
import ComplexInput from 'src/app/components/golos-ui/ComplexInput';
import SplashLoader from 'src/app/components/golos-ui/SplashLoader';
import Icon from 'src/app/components/golos-ui/Icon';
import DialogManager from 'app/components/elements/common/DialogManager';
import { parseAmount } from 'src/app/helpers/currency';
import { fetchCurrentStateAction } from 'src/app/redux/actions/fetch';
import AccountNameInput from 'src/app/components/common/AccountNameInput';

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
        pageAccountName: PropTypes.string,
        onRef: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    constructor(props) {
        super(props);

        let target = '';

        if (props.pageAccountName && props.pageAccountName !== props.myUser.get('username')) {
            target = props.pageAccountName;
        }

        this.state = {
            target,
            amount: '',
            currency: CURRENCIES.GBG,
            note: '',
            amountInFocus: false,
            loader: false,
            disabled: false,
        };
    }

    render() {
        const { myAccount, myUser } = this.props;
        const { target, amount, currency, note, loader, disabled, amountInFocus } = this.state;

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

        if (!error) {
            if (myUser.get('username') === target) {
                error = 'Нельзя выполнить перевод самому себе';
            }
        }

        const allow = target && value > 0 && !error && !loader && !disabled;

        return (
            <DialogFrameStyled
                title={'Передать пользователю'}
                titleSize={20}
                icon="coins"
                buttons={[
                    {
                        text: tt('g.cancel'),
                        onClick: this._onCloseClick,
                    },
                    {
                        text: 'Передать',
                        primary: true,
                        disabled: !allow,
                        onClick: this._onOkClick,
                    },
                ]}
                onCloseClick={this._onCloseClick}
            >
                <Content>
                    <SubHeader>Отправить средства на другой аккаунт</SubHeader>
                    <Body>
                        <Column>
                            <Section>
                                <Label>Кому</Label>
                                <AccountNameInput
                                    name="account"
                                    block
                                    autoFocus
                                    placeholder={'Отправить аккаунту'}
                                    value={target}
                                    onChange={this._onTargetChange}
                                />
                            </Section>
                            <Section>
                                <Label>Сколько</Label>
                                <ComplexInput
                                    placeholder={`Доступно ${balance.toFixed(3)}`}
                                    spellCheck="false"
                                    value={amount}
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
                                    <NoteIcon name="note" /> Заметка
                                </Label>
                                <Note
                                    placeholder={'Эта заметка является публичной'}
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
            DialogManager.dangerConfirm('Вы действительно хотите закрыть окно?').then(y => {
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
        const { myUser } = this.props;
        const { target, amount, currency, note, loader, disabled } = this.state;

        if (loader || disabled) {
            return;
        }

        const operation = {
            from: myUser.get('username'),
            to: target,
            amount: parseFloat(amount.replace(/\s+/, '')).toFixed(3) + ' ' + currency,
            memo: note,
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
                    DialogManager.alert('Аккаунт не существует');
                } else if (errStr !== 'Canceled') {
                    DialogManager.alert(errStr);
                }
            } else {
                this.setState({
                    loader: false,
                });

                DialogManager.info(`Перевод на аккаунт ${operation.to} успешно завершен!`).then(
                    () => {
                        this.props.onClose();
                    }
                );
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
    dispatch => ({
        transfer(operation, callback) {
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
            );
        },
    })
)(TransferDialog);
