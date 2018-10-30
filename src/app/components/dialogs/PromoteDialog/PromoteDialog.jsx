import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import SimpleInput from 'golos-ui/SimpleInput';
import ComplexInput from 'golos-ui/ComplexInput';
import DialogManager from 'app/components/elements/common/DialogManager';
import DialogFrame from 'app/components/dialogs/DialogFrame';

const DialogFrameStyled = styled(DialogFrame)`
    flex-basis: 240px;
`;

const SubHeader = styled.div`
    padding: 8px 30px 15px;
    text-align: center;
    font-size: 14px;
    color: #959595;
`;

const Content = styled.div`
    padding: 10px 30px 14px;
`;

const ErrorBlock = styled.div`
    min-height: 24px;
    margin-top: 12px;
    font-size: 15px;
    color: #f00;
`;

const Section = styled.div`
    margin: 10px 0;
`;

const Label = styled.div`
    margin-bottom: 9px;
    font-size: 14px;
`;

export default class PromoteDialog extends Component {
    static propTypes = {
        myAccountName: PropTypes.string.isRequired,
        postLink: PropTypes.string.isRequired,
        sanitizedPost: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
    };

    state = {
        isLock: false,
        amount: '',
        activeKey: '',
        errorText: null,
        isDisabled: true,
    };

    componentWillUpdate(newProps, nextState) {
        const amount = nextState.amount.trim();
        const activeKey = nextState.activeKey.trim();

        const isDisabled = !amount || !activeKey;

        if (nextState.isDisabled !== isDisabled) {
            this.setState({
                isDisabled,
            });
        }
    }

    confirmClose = () => {
        const { amount, activeKey } = this.state;

        return !amount.trim() && !activeKey.trim();
    };

    onAmountChange = e => {
        this.setState({
            amount: e.target.value,
            errorText: null,
        });
    };

    onActiveKeyChange = e => {
        this.setState({
            activeKey: e.target.value,
            errorText: null,
        });
    };

    onOkClick = () => {
        const { myAccountName, postLink } = this.props;
        const { amount, activeKey } = this.state;

        const floatAmount = parseFloat(amount);

        if (Number.isNaN(floatAmount) || floatAmount <= 0 || !activeKey.trim()) {
            this.setState({
                errorText: tt('dialogs_promote.fill_form_error'),
            });
            return;
        }

        const [author, permLink] = postLink.split('/');

        this.setState({
            isLock: true,
        });

        this.props.promote({
            myAccountName,
            amount: floatAmount.toFixed(3) + ' GBG',
            author,
            permLink,
            password: activeKey,
            onSuccess: this.onSuccess,
            onError: this.onError,
        });
    };

    onSuccess = () => {
        this.props.showNotification(tt('dialogs_promote.success'));
        this.props.onClose();
    };

    onError = err => {
        this.setState({
            isLock: false,
        });

        DialogManager.alert(`${tt('g.error')}:\n${err}`);
    };

    onCloseClick = () => {
        this.props.onClose();
    };

    render() {
        const { balance } = this.props;
        const { isLock, amount, activeKey, isDisabled, errorText } = this.state;

        return (
            <DialogFrameStyled
                title={tt('dialogs_promote.title')}
                titleSize={20}
                icon="brilliant"
                buttons={[
                    {
                        text: tt('g.cancel'),
                        disabled: isLock,
                        onClick: this.onCloseClick,
                    },
                    {
                        text: tt('dialogs_promote.promote_button'),
                        disabled: isDisabled || isLock,
                        primary: true,
                        onClick: this.onOkClick,
                    },
                ]}
                onCloseClick={this.onCloseClick}
            >
                <SubHeader>{tt('dialogs_promote.description')}</SubHeader>
                <Content>
                    <Section>
                        <Label>{tt('dialogs_promote.amount')}</Label>
                        <ComplexInput
                            disabled={isLock}
                            placeholder={tt('dialogs_transfer.amount_placeholder', {
                                amount: balance,
                            })}
                            spellCheck="false"
                            value={amount}
                            autoFocus
                            onChange={this.onAmountChange}
                            activeId="GBG"
                            buttons={[{ id: 'GBG', title: 'GBG' }]}
                        />
                    </Section>
                    <Section>
                        <Label>{tt('dialogs_promote.active_key')}</Label>
                        <SimpleInput
                            type="password"
                            name="active_key"
                            disabled={isLock}
                            spellCheck="false"
                            autoCorrect="off"
                            autoCapitalize="off"
                            value={activeKey}
                            onChange={this.onActiveKeyChange}
                        />
                    </Section>
                    <ErrorBlock>{errorText}</ErrorBlock>
                </Content>
            </DialogFrameStyled>
        );
    }
}
