import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Shrink from 'golos-ui/Shrink';
import Slider from 'golos-ui/Slider';
import ComplexInput from 'golos-ui/ComplexInput';
import SplashLoader from 'golos-ui/SplashLoader';
import { Checkbox } from 'golos-ui/Form';
import { processError } from 'src/app/helpers/dialogs';

import { MIN_VOICE_POWER } from 'src/app/constants/config';
import { isBadActor } from 'src/app/utils/ChainValidation';
import DialogFrame from 'src/app/components/dialogs/DialogFrame';
import DialogManager from 'src/app/components/elements/common/DialogManager';
import { parseAmount } from 'src/app/helpers/currency';
import { boldify } from 'src/app/helpers/text';
import { vestsToGolos, golosToVests } from 'src/app/utils/StateFunctions';
import DialogTypeSelect from 'src/app/components/userProfile/common/DialogTypeSelect';
import AccountNameInput from 'src/app/components/common/AccountNameInput';
import Icon from '../../golos-ui/Icon/Icon';

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

const ErrorLine = styled(FooterLine)`
  color: #ff4641;
`;

const HintLine = styled(FooterLine)`
  font-size: 14px;
  color: #666;
`;

const Hint = styled.span`
  color: #3684ff;
  cursor: help;
`;

const PowerDownText = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: #393636;
`;

export default class ConvertDialog extends PureComponent {
  static propTypes = {
    myAccount: PropTypes.any,
    globalProps: PropTypes.any,
    toWithdraw: PropTypes.string,
    withdrawn: PropTypes.string,
    transfer: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    type: TYPES.GOLOS,
    target: '',
    amount: '',
    amountInFocus: false,
    saveTo: false,
    loader: false,
    disabled: false,
  };

  render() {
    const { myAccount, globalProps, toWithdraw, withdrawn } = this.props;
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
      const { golos } = getVesting(myAccount, globalProps);

      balance = Math.max(0, parseFloat(golos) - MIN_VOICE_POWER);
      balanceString = balance.toFixed(3);
    } else if (type === TYPES.GBG) {
      balanceString = myAccount.get('sbd_balance');
      balance = parseFloat(balanceString);
    }

    const balanceString2 = balanceString.match(/^[^\s]*/)[0];

    let { value, error } = parseAmount(amount, balance, !amountInFocus);
    if (isBadActor(target)) {
      error = tt('chainvalidation_js.use_caution_sending_to_this_account');
    }

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
            onClick={this.onClickType}
          />
          <SubHeader>
            <Shrink height={72}>{this._renderSubHeader()}</Shrink>
          </SubHeader>
          <Content>
            {toWithdraw && type === TYPES.POWER ? (
              <PowerDownText>
                {boldify(
                  tt('dialogs_convert.power_down_line', {
                    all: toWithdraw,
                    done: withdrawn,
                  })
                )}
              </PowerDownText>
            ) : null}
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
              {error ? <ErrorLine>{error}</ErrorLine> : hint ? <HintLine>{hint}</HintLine> : null}
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
                <AccountNameInput
                  name="account"
                  block
                  autoFocus
                  placeholder={tt('dialogs_transfer.to_placeholder')}
                  value={target}
                  onChange={this._onTargetChange}
                />
              </Section>
            ) : null}
          </Fragment>
        );
      case TYPES.POWER:
        const cur = Math.round(parseFloat(amount.replace(/\s+/, '')) * 1000) || 0;
        const max = Math.round(balance * 1000);

        return (
          <SliderWrapper>
            <Slider
              value={cur}
              max={max}
              showCaptions
              percentsInCaption
              hideHandleValue
              onChange={this.onSliderChange}
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
            <SubHeaderLine>{tt('dialogs_transfer.convert.tabs.golos_gp.tip_1')}</SubHeaderLine>
            <SubHeaderLine>
              {tt('dialogs_transfer.convert.tabs.golos_gp.tip_2')}{' '}
              <Hint data-hint={tt('dialogs_transfer.convert.tabs.golos_gp.hint')}>(?)</Hint>
              {'. '}
              {tt('dialogs_transfer.convert.tabs.golos_gp.tip_3')}
            </SubHeaderLine>
          </Fragment>
        );
      case TYPES.POWER:
        return <SubHeaderLine>{tt('dialogs_transfer.convert.tabs.gp_golos.tip_1')}</SubHeaderLine>;
      case TYPES.GBG:
        return (
          <Fragment>
            <SubHeaderLine>{tt('dialogs_transfer.convert.tabs.gbg_golos.tip_1')}</SubHeaderLine>
            <SubHeaderLine>
              {tt('dialogs_transfer.convert.tabs.gbg_golos.tip_2')}{' '}
              <Hint data-hint={tt('dialogs_transfer.convert.tabs.gbg_golos.hint')}>(?)</Hint>{' '}
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

  _onTargetChange = value => {
    this.setState({
      target: value,
    });
  };

  _onCloseClick = () => {
    this.props.onClose();
  };

  _onOkClick = () => {
    const { myUser, globalProps } = this.props;
    const { target, amount, type, saveTo, loader, disabled } = this.state;

    const TYPES_SUCCESS_TEXT = {
      GOLOS: tt('dialogs_transfer.operation_success'),
      POWER: tt('dialogs_transfer.operation_started'),
      GBG: tt('dialogs_transfer.operation_started'),
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
      };
    } else if (type === TYPES.POWER) {
      operationType = 'withdraw_vesting';

      const vesting = golosToVests(parseFloat(amount.replace(/\s+/, '')), globalProps);

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

        processError(err);
      } else {
        this.setState({
          loader: false,
        });

        this.props.showNotification(TYPES_SUCCESS_TEXT[type]);
        this.props.onClose();
      }
    });
  };

  onClickType = type => {
    this.setState({
      type: type,
      amount: '',
      saveTo: false,
    });
  };

  onSliderChange = value => {
    let amount = '';

    if (value > 0) {
      amount = (value / 1000).toFixed(3);
    }

    this.setState({
      amount,
    });
  };
}

function getVesting(account, props) {
  const vesting = parseFloat(account.get('vesting_shares'));
  const delegated = parseFloat(account.get('delegated_vesting_shares'));

  const availableVesting = vesting - delegated;

  return {
    golos: vestsToGolos(availableVesting.toFixed(6) + ' GESTS', props),
  };
}
