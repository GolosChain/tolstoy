import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { MIN_VOICE_POWER } from 'app/client_config';
import transaction from 'app/redux/Transaction';
import DialogFrame from 'app/components/dialogs/DialogFrame';
import DialogManager from 'app/components/elements/common/DialogManager';
import SplashLoader from 'src/app/components/golos-ui/SplashLoader';
import { Checkbox } from 'src/app/components/golos-ui/Form';
import { parseAmount } from 'src/app/helpers/currency';
import { vestsToGolos, golosToVests } from 'app/utils/StateFunctions';
import Shrink from 'src/app/components/golos-ui/Shrink';
import Slider from 'src/app/components/golos-ui/Slider';
import SimpleInput from 'src/app/components/golos-ui/SimpleInput';
import ComplexInput from 'src/app/components/golos-ui/ComplexInput';
import DialogTypeSelect from 'src/app/components/userProfile/common/DialogTypeSelect';
import { fetchCurrentStateAction } from 'src/app/redux/actions/fetch';

const POWER_TO_GOLOS_INTERVAL = 13; // weeks

const TYPES = {
    GOLOS: 'GOLOS',
    POWER: 'POWER',
    GBG: 'GBG',
};

const DialogFrameStyled = styled(DialogFrame)`
    flex-basis: 580px;
`;

const Container = styled.div``;

const Content = styled.div`
    padding: 10px 30px 14px;
`;

const SubHeader = styled.div`
    padding: 30px 30px 15px;
    border-bottom: 1px solid #e1e1e1;
    text-align: center;
    font-size: 14px;
    color: #959595;
`;

const SubHeaderLine = styled.div`
    margin-bottom: 10px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const Body = styled.div`
    height: auto;
    transition: height 0.15s;
    overflow: hidden;
`;

const Section = styled.div`
    margin: 10px 0;

    ${is('flex')`
        display: flex;
    `};
`;

const Label = styled.div`
    margin-bottom: 9px;
    font-size: 14px;
`;

const SliderWrapper = styled.div`
    margin-bottom: 3px;
`;

const Footer = styled.div`
    min-height: 25px;
`;

const FooterLine = styled.div`
    animation: fade-in 0.15s;
`;

const ErrorLine = FooterLine.extend`
    color: #ff4641;
`;

const HintLine = FooterLine.extend`
    font-size: 14px;
    color: #666;
`;

const Hint = styled.span`
    color: #3684ff;
    cursor: help;
`;

class ConvertDialog extends PureComponent {
    state = {
        type: TYPES.GOLOS,
        target: '',
        amount: '',
        amountInFocus: false,
        saveTo: false,
        loader: false,
        disabled: false,
    };

    constructor(props) {
        super(props);

        this._globalProps = props.globalProps.toJS();
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.globalProps !== newProps.globalProps) {
            this._globalProps = newProps.globalProps.toJS();
        }
    }

    render() {
        const { myAccount } = this.props;
        const { target, amount, loader, disabled, amountInFocus, type, saveTo } = this.state;

        const TYPES_TRANSLATE = {
            GOLOS: tt('token_names.LIQUID_TOKEN'),
            POWER: tt('token_names.VESTING_TOKEN'),
            GBG: 'GBG',
        };

        let balance = null;
        let balanceString = null;

        if (type === TYPES.GOLOS) {
            balanceString = myAccount.get('balance');
            balance = parseFloat(balanceString);
        } else if (type === TYPES.POWER) {
            const { golos } = getVesting(myAccount, this._globalProps);

            balance = Math.max(0, parseFloat(golos) - MIN_VOICE_POWER);
            balanceString = balance.toFixed(3);
        } else if (type === TYPES.GBG) {
            balanceString = myAccount.get('sbd_balance');
            balance = parseFloat(balanceString);
        }

        const balanceString2 = balanceString.match(/^[^\s]*/)[0];

        const { value, error } = parseAmount(amount, balance, !amountInFocus);

        const targetCheck = saveTo ? target && target.trim() : true;

        const allow = targetCheck && value > 0 && !error && !loader && !disabled;

        let hint = null;

        if (type === TYPES.POWER && value > 0) {
            const perWeek = value / POWER_TO_GOLOS_INTERVAL;
            const perWeekStr = perWeek.toFixed(3);

            hint = tt('dialogs_transfer.convert.tabs.gp_golos.per_week', { amount: perWeekStr });
        }

        return (
            <DialogFrameStyled
                title={tt('dialogs_transfer.convert.title')}
                titleSize={20}
                icon="refresh"
                buttons={[
                    {
                        text: tt('g.cancel'),
                        onClick: this._onCloseClick,
                    },
                    {
                        text: tt('dialogs_transfer.convert.convert_button'),
                        primary: true,
                        disabled: !allow,
                        onClick: this._onOkClick,
                    },
                ]}
                onCloseClick={this._onCloseClick}
            >
                <Container>
                    <DialogTypeSelect
                        mobileColumn
                        activeId={type}
                        buttons={[
                            {
                                id: TYPES.GOLOS,
                                title: tt('dialogs_transfer.convert.tabs.golos_gp.title'),
                            },
                            {
                                id: TYPES.POWER,
                                title: tt('dialogs_transfer.convert.tabs.gp_golos.title'),
                            },
                            {
                                id: TYPES.GBG,
                                title: tt('dialogs_transfer.convert.tabs.gbg_golos.title'),
                            },
                        ]}
                        onClick={this._onClickType}
                    />
                    <SubHeader>
                        <Shrink height={72}>{this._renderSubHeader()}</Shrink>
                    </SubHeader>
                    <Content>
                        <Body style={{ height: this._getBodyHeight() }}>
                            <Section>
                                <Label>{tt('dialogs_transfer.amount')}</Label>
                                <ComplexInput
                                    placeholder={tt('dialogs_transfer.amount_placeholder', {
                                        amount: balanceString2,
                                    })}
                                    spellCheck="false"
                                    value={amount}
                                    onChange={this._onAmountChange}
                                    onFocus={this._onAmountFocus}
                                    onBlur={this._onAmountBlur}
                                    activeId={type}
                                    buttons={[{ id: type, title: TYPES_TRANSLATE[type] }]}
                                />
                            </Section>
                            {this._renderAdditionalSection(balance)}
                        </Body>
                        <Footer>
                            {error ? (
                                <ErrorLine>{error}</ErrorLine>
                            ) : hint ? (
                                <HintLine>{hint}</HintLine>
                            ) : null}
                        </Footer>
                    </Content>
                </Container>
                {loader ? <SplashLoader /> : null}
            </DialogFrameStyled>
        );
    }

    _renderAdditionalSection(balance) {
        const { type, target, saveTo, amount } = this.state;

        switch (type) {
            case TYPES.GOLOS:
                return (
                    <Fragment>
                        <Section flex>
                            <Checkbox
                                title={tt('dialogs_transfer.transfer_check')}
                                inline
                                value={saveTo}
                                onChange={this._onSaveTypeChange}
                            />
                        </Section>
                        {saveTo ? (
                            <Section>
                                <Label>{tt('dialogs_transfer.to')}</Label>
                                <SimpleInput
                                    name="account"
                                    spellCheck="false"
                                    placeholder={tt('dialogs_transfer.to_placeholder')}
                                    value={target}
                                    onChange={this._onTargetChange}
                                />
                            </Section>
                        ) : null}
                    </Fragment>
                );
            case TYPES.POWER:
                const cur = Math.round(parseFloat(amount.replace(/\s+/, '')) * 1000);
                const max = Math.round(balance * 1000);

                return (
                    <SliderWrapper>
                        <Slider
                            value={cur}
                            max={max}
                            showCaptions
                            hideHandleValue
                            onChange={this._onSliderChange}
                        />
                    </SliderWrapper>
                );
        }
    }

    confirmClose() {
        const { amount, saveTo, target } = this.state;

        if (amount.trim() || (saveTo ? target.trim() : false)) {
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

    _getBodyHeight() {
        const { type, saveTo } = this.state;

        // This height constants taken by experimental way from actual height in browser
        // Heights needs from smooth height animation
        switch (type) {
            case TYPES.GOLOS:
                return saveTo ? 192 : 117;
            case TYPES.POWER:
                return 138;
            case TYPES.GBG:
                return 85;
        }
    }

    _renderSubHeader() {
        const { type } = this.state;

        switch (type) {
            case TYPES.GOLOS:
                return (
                    <Fragment>
                        <SubHeaderLine>
                            {tt('dialogs_transfer.convert.tabs.golos_gp.tip_1')}
                        </SubHeaderLine>
                        <SubHeaderLine>
                            {tt('dialogs_transfer.convert.tabs.golos_gp.tip_2')}{' '}
                            <Hint data-hint={tt('dialogs_transfer.convert.tabs.golos_gp.hint')}>
                                (?)
                            </Hint>
                            {'. '}
                            {tt('dialogs_transfer.convert.tabs.golos_gp.tip_3')}
                        </SubHeaderLine>
                    </Fragment>
                );
            case TYPES.POWER:
                return (
                    <SubHeaderLine>
                        {tt('dialogs_transfer.convert.tabs.gp_golos.tip_1')}
                    </SubHeaderLine>
                );
            case TYPES.GBG:
                return (
                    <Fragment>
                        <SubHeaderLine>
                            {tt('dialogs_transfer.convert.tabs.gbg_golos.tip_1')}
                        </SubHeaderLine>
                        <SubHeaderLine>
                            {tt('dialogs_transfer.convert.tabs.gbg_golos.tip_2')}{' '}
                            <Hint data-hint={tt('dialogs_transfer.convert.tabs.gbg_golos.hint')}>
                                (?)
                            </Hint>{' '}
                            {tt('dialogs_transfer.convert.tabs.gbg_golos.tip_3')}
                        </SubHeaderLine>
                    </Fragment>
                );
        }
    }

    _onSaveTypeChange = checked => {
        this.setState({
            saveTo: checked,
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

    _onTargetChange = e => {
        this.setState({
            target: e.target.value,
        });
    };

    _onCloseClick = () => {
        this.props.onClose();
    };

    _onOkClick = () => {
        const { myUser } = this.props;
        const { target, amount, type, saveTo, loader, disabled } = this.state;

        const TYPES_SUCCESS_TEXT = {
            GOLOS: tt('dialogs.operation_success'),
            POWER: tt('dialogs.operation_started'),
            GBG: tt('dialogs.operation_started'),
        };

        if (loader || disabled) {
            return;
        }

        this.setState({
            loader: true,
            disabled: true,
        });

        const iAm = myUser.get('username');

        let operationType;
        let operation;

        if (type === TYPES.GOLOS) {
            operationType = 'transfer_to_vesting';
            operation = {
                from: iAm,
                to: saveTo ? target.trim() : iAm,
                amount: parseFloat(amount.replace(/\s+/, '')).toFixed(3) + ' GOLOS',
                memo: '',
                //request_id: Math.floor((Date.now() / 1000) % 4294967296),
            };
        } else if (type === TYPES.POWER) {
            operationType = 'withdraw_vesting';

            const vesting = golosToVests(parseFloat(amount.replace(/\s+/, '')), this._globalProps);

            operation = {
                account: iAm,
                vesting_shares: vesting + ' GESTS',
            };
        } else if (type === TYPES.GBG) {
            operationType = 'convert';
            operation = {
                owner: iAm,
                amount: parseFloat(amount.replace(/\s+/, '')).toFixed(3) + ' GBG',
                requestid: Math.floor(Date.now() / 1000),
            };
        }

        this.props.transfer(operationType, operation, err => {
            if (err) {
                this.setState({
                    loader: false,
                    disabled: false,
                });

                if (err !== 'Canceled') {
                    DialogManager.alert(err.toString());
                }
            } else {
                this.setState({
                    loader: false,
                });

                DialogManager.info(TYPES_SUCCESS_TEXT[type]).then(() => {
                    this.props.onClose();
                });
            }
        });
    };

    _onClickType = type => {
        this.setState({
            type: type,
            amount: '',
            saveTo: false,
        });
    };

    _onSliderChange = value => {
        let amount = '';

        if (value > 0) {
            amount = (value / 1000).toFixed(3);
        }

        this.setState({
            amount,
        });
    };
}

export default connect(
    state => {
        const globalProps = state.global.get('props');
        const myUser = state.user.get('current');
        const myAccount = myUser ? state.global.getIn(['accounts', myUser.get('username')]) : null;

        return {
            myUser,
            myAccount,
            globalProps,
        };
    },
    dispatch => ({
        transfer(type, operation, callback) {
            dispatch(
                transaction.actions.broadcastOperation({
                    type,
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
)(ConvertDialog);

function getVesting(account, props) {
    const vesting = parseFloat(account.get('vesting_shares'));
    const delegated = parseFloat(account.get('delegated_vesting_shares'));

    const availableVesting = vesting - delegated;

    return {
        golos: vestsToGolos(availableVesting.toFixed(6) + ' GESTS', props),
    };
}
