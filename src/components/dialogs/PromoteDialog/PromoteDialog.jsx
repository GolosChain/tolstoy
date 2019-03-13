import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { processError } from 'helpers/dialogs';

import ComplexInput from 'components/golos-ui/ComplexInput';
import DialogFrame from 'components/dialogs/DialogFrame';

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
    errorText: null,
    isDisabled: true,
  };

  componentWillUpdate(newProps, nextState) {
    const amount = nextState.amount.trim();

    const isDisabled = !amount;

    if (nextState.isDisabled !== isDisabled) {
      this.setState({
        isDisabled,
      });
    }
  }

  confirmClose = () => {
    const { amount } = this.state;

    return !amount.trim();
  };

  onAmountChange = e => {
    this.setState({
      amount: e.target.value.replace(/,/g, '.').replace(/[^\d .]+/g, ''),
      errorText: null,
    });
  };

  onOkClick = () => {
    const { myAccountName, postLink } = this.props;
    const { amount } = this.state;

    const floatAmount = parseFloat(amount.replace(/\s+/, ''));

    if (Number.isNaN(floatAmount) || floatAmount <= 0) {
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

    processError(err);
  };

  onCloseClick = () => {
    this.props.onClose();
  };

  render() {
    const { balance } = this.props;
    const { isLock, amount, isDisabled, errorText } = this.state;

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
          <ErrorBlock>{errorText}</ErrorBlock>
        </Content>
      </DialogFrameStyled>
    );
  }
}
