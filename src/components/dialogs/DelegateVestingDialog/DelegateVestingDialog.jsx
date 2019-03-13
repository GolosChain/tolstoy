import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import { api } from 'mocks/golos-js';

import ComplexInput from 'components/golos-ui/ComplexInput';
import SplashLoader from 'components/golos-ui/SplashLoader';
import { CheckboxInput } from 'components/golos-ui/Form';
import Shrink from 'components/golos-ui/Shrink';
import Slider from 'components/golos-ui/Slider';
import { processError } from 'helpers/dialogs';

import { MIN_VOICE_POWER } from 'constants/config';
import transaction from 'app/redux/Transaction';
import { isBadActor } from 'utils/ChainValidation';
import DialogFrame from 'components/dialogs/DialogFrame';
import DialogManager from 'components/elements/common/DialogManager';
import DialogTypeSelect from 'components/userProfile/common/DialogTypeSelect';
import { parseAmount2 } from 'helpers/currency';
import { vestsToGolos, golosToVests, getVesting } from 'utils/StateFunctions';
import DelegationsList from './DelegationsList';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import DelegationEdit from './DelegationEdit';
import { showNotification } from 'app/redux/actions/ui';
import { fetchCurrentStateAction } from 'app/redux/actions/fetch';
import AccountNameInput from 'components/common/AccountNameInput';
import Icon from '../../golos-ui/Icon/Icon';

const TYPES = {
  DELEGATE: 'DELEGATE',
  CANCEL: 'CANCEL',
};

const DEFAULT_DELEGATED_VESTING_INTEREST_RATE = 25;

const DialogFrameStyled = styled(DialogFrame)`
  flex-basis: 580px;

  @media (max-width: 550px) {
    flex-basis: 340px;
  }
`;

const Container = styled.div``;

const Content = styled.div`
  padding: 10px 30px 14px;
`;

const SubHeader = styled.div`
  padding: 30px;
  margin-bottom: 1px;
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

const Columns = styled.div`
  display: flex;
  margin: 0 -10px;

  @media (max-width: 550px) {
    display: block;
  }
`;

const Column = styled.div`
  flex-basis: 100px;
  flex-grow: 1;
  margin: 0 10px;
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

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

class DelegateVestingDialog extends PureComponent {
  constructor(props) {
    super(props);

    let target = '';

    if (props.toAccountName && props.toAccountName !== props.myUser.get('username')) {
      target = props.toAccountName;
    }

    this.state = {
      type: TYPES.DELEGATE,
      target,
      amount: '',
      amountInFocus: false,
      loader: false,
      disabled: false,
      delegationError: null,
      delegationData: null,
      editAccountName: null,
      autoFocusValue: Boolean(target),
      receiveInterest: false,
      interestRate: DEFAULT_DELEGATED_VESTING_INTEREST_RATE,
    };

    this._globalProps = props.globalProps.toJS();
  }

  componentDidMount() {
    this.loadDelegationsData();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.globalProps !== newProps.globalProps) {
      this._globalProps = newProps.globalProps.toJS();
    }
  }

  render() {
    const { myAccount } = this.props;
    const { target, amount, loader, disabled, amountInFocus, type } = this.state;

    const { golos } = getVesting(myAccount, this._globalProps);

    const availableBalance = Math.max(0, Math.round((parseFloat(golos) - MIN_VOICE_POWER) * 1000));
    const availableBalanceString = (availableBalance / 1000).toFixed(3);

    let { value, error } = parseAmount2(amount, availableBalance, !amountInFocus, 1000);
    if (isBadActor(target)) {
      error = tt('chainvalidation_js.use_caution_sending_to_this_account');
    }

    const allow = target && value > 0 && !error && !loader && !disabled;

    const hint = null;

    const params = {
      availableBalance,
      availableBalanceString,
    };

    let buttons;

    if (type === TYPES.DELEGATE) {
      buttons = [
        {
          text: tt('g.cancel'),
          onClick: this.onCloseClick,
        },
        {
          text: tt('dialogs_transfer.delegate_vesting.delegate_button'),
          primary: true,
          disabled: !allow,
          onClick: this.onOkClick,
        },
      ];
    } else {
      buttons = [
        {
          text: tt('g.close'),
          onClick: this.onCloseClick,
        },
      ];
    }

    return (
      <DialogFrameStyled
        title={tt('dialogs_transfer.delegate_vesting.title')}
        titleSize={20}
        icon="voice"
        buttons={buttons}
        onCloseClick={this.onCloseClick}
      >
        <Container>
          <DialogTypeSelect
            activeId={type}
            buttons={[
              {
                id: TYPES.DELEGATE,
                title: tt('dialogs_transfer.delegate_vesting.tabs.delegate.title'),
              },
              {
                id: TYPES.CANCEL,
                title: tt('dialogs_transfer.delegate_vesting.tabs.delegated.title'),
              },
            ]}
            onClick={this.onTypeClick}
          />
          {type === TYPES.DELEGATE ? (
            <Fragment>
              <SubHeader>
                <Shrink height={72}>
                  {this._getHintText().map((line, i) => (
                    <SubHeaderLine key={i}>{line}</SubHeaderLine>
                  ))}
                </Shrink>
              </SubHeader>
              <Content>
                <Body style={{ height: 'auto' }}>{this._renderDelegateBody(params)}</Body>
                <Footer>
                  {error ? (
                    <ErrorLine>{error}</ErrorLine>
                  ) : hint ? (
                    <HintLine>{hint}</HintLine>
                  ) : null}
                </Footer>
              </Content>
            </Fragment>
          ) : (
            <Content>{this._renderCancelBody(params)}</Content>
          )}
        </Container>
        {loader ? <SplashLoader /> : null}
      </DialogFrameStyled>
    );
  }

  _renderDelegateBody({ availableBalanceString }) {
    const { target, amount, autoFocusValue, receiveInterest } = this.state;

    return (
      <Fragment>
        <Columns>
          <Column>
            <Section>
              <Label>{tt('dialogs_transfer.to')}</Label>
              <AccountNameInput
                name="account"
                block
                placeholder={tt('dialogs_transfer.delegate_vesting.tabs.delegated.to_placeholder')}
                autoFocus={!autoFocusValue}
                value={target}
                onChange={this._onTargetChange}
              />
            </Section>
          </Column>
          <Column>
            <Section>
              <Label>{tt('dialogs_transfer.delegate_vesting.tabs.delegated.amount_label')}</Label>
              <ComplexInput
                placeholder={tt('dialogs_transfer.amount_placeholder', {
                  amount: availableBalanceString,
                })}
                spellCheck="false"
                value={amount}
                activeId="power"
                buttons={[{ id: 'power', title: tt('token_names.VESTING_TOKEN3') }]}
                autoFocus={autoFocusValue}
                onChange={this._onAmountChange}
                onFocus={this._onAmountFocus}
                onBlur={this._onAmountBlur}
              />
            </Section>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <Section>
              <CheckboxInput
                value={receiveInterest}
                title={tt('dialogs_transfer.delegate_vesting.tabs.delegate.receive_rewards')}
                onChange={this.receiveInterestChange}
              />
            </Section>
          </Column>
        </Columns>
        <Columns>
          {receiveInterest && (
            <Column>
              <Section>
                <Label>{tt('dialogs_transfer.delegate_vesting.tabs.delegate.interest_rate')}</Label>
                {this.renderInterestRateSlider()}
              </Section>
            </Column>
          )}
        </Columns>
      </Fragment>
    );
  }

  renderInterestRateSlider() {
    const { chainProps } = this.props;
    const { interestRate } = this.state;

    if (!chainProps) {
      return <LoadingIndicator type="circle" size={25} />;
    }

    const maxValue = chainProps.get('max_delegated_vesting_interest_rate') / 100;
    return (
      <Slider value={interestRate} min={0} max={maxValue} onChange={this.onInterestRateChange} />
    );
  }

  _renderCancelBody({ availableBalance }) {
    const { myUser } = this.props;
    const { delegationError, delegationData, editAccountName } = this.state;

    if (delegationError) {
      return String(delegationError);
    }

    if (!delegationData) {
      return (
        <LoaderWrapper>
          <LoadingIndicator type="circle" size={60} />
        </LoaderWrapper>
      );
    }

    let delegation = null;
    let vestingShares = null;

    if (editAccountName) {
      const data = delegationData.find(data => data.delegatee === editAccountName);

      if (data) {
        delegation = data;
        vestingShares = Math.round(
          parseFloat(vestsToGolos(data.vesting_shares, this._globalProps)) * 1000
        );
      }
    }

    return (
      <Fragment>
        <DelegationsList
          myAccountName={myUser.get('username')}
          globalProps={this._globalProps}
          data={delegationData}
          onEditClick={this._onDelegationEdit}
          onCancelClick={this._onDelegationCancel}
        />
        {delegation ? (
          <DelegationEdit
            value={vestingShares}
            max={availableBalance + vestingShares}
            onSave={this._onDelegationEditSave}
            onCancel={this._onDelegationEditCancel}
          />
        ) : null}
      </Fragment>
    );
  }

  confirmClose() {
    const { amount, target } = this.state;

    if (amount.trim() || target) {
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

  _getHintText() {
    const { type } = this.state;

    switch (type) {
      case TYPES.DELEGATE:
        return [
          tt('dialogs_transfer.delegate_vesting.tabs.delegate.tip_1'),
          tt('dialogs_transfer.delegate_vesting.tabs.delegate.tip_2'),
        ];
    }

    return [];
  }

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

  receiveInterestChange = checked => {
    if (checked) {
      this.props.fetchChainProperties();
    }

    this.setState({
      receiveInterest: checked,
    });
  };

  onInterestRateChange = value => {
    this.setState({
      interestRate: value,
    });
  };

  onCloseClick = () => {
    this.props.onClose();
  };

  onOkClick = () => {
    const { myUser } = this.props;
    const {
      target,
      amount,
      loader,
      disabled,
      delegationData,
      receiveInterest,
      interestRate,
    } = this.state;

    if (loader || disabled) {
      return;
    }

    this.setState({
      loader: true,
      disabled: true,
    });

    const iAm = myUser.get('username');

    let alreadyDelegated = 0;

    if (delegationData) {
      const data = delegationData.find(data => data.delegatee === target);

      if (data) {
        alreadyDelegated = parseFloat(data.vesting_shares);
      }
    }

    const vesting = (
      alreadyDelegated +
      golosToVests(parseFloat(amount.replace(/\s+/, '')), this._globalProps, true)
    ).toFixed(6);

    const operation = {
      delegator: iAm,
      delegatee: target,
      vesting_shares: vesting + ' GESTS',
    };

    if (receiveInterest) {
      operation.interest_rate = interestRate * 100;
    }

    this.props.delegate(operation, receiveInterest, err => {
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

        DialogManager.info(tt('dialogs_transfer.operation_success'));

        this.loadDelegationsData();
      }
    });
  };

  updateDelegation(delegatee, value) {
    const { myUser } = this.props;

    const vesting = value > 0 ? golosToVests(value / 1000, this._globalProps) : '0.000000';

    const iAm = myUser.get('username');

    const operation = {
      delegator: iAm,
      delegatee: delegatee,
      vesting_shares: vesting + ' GESTS',
    };

    this.setState({
      disabled: true,
      loader: true,
    });

    this.props.delegate(operation, false, err => {
      if (err) {
        this.setState({
          disabled: false,
          loader: false,
        });

        processError(err);
      } else {
        this.setState({
          disabled: false,
          loader: false,
          editAccountName: null,
        });

        this.loadDelegationsData();
      }
    });
  }

  onTypeClick = type => {
    this.setState({
      type: type,
      amount: '',
      saveTo: false,
    });
  };

  async loadDelegationsData() {
    const { myUser } = this.props;

    try {
      const result = await api.getVestingDelegationsAsync(
        myUser.get('username'),
        '',
        1000,
        'delegated'
      );

      this.setState({
        delegationError: null,
        delegationData: result,
      });
    } catch (err) {
      this.setState({
        delegationError: err,
        delegationData: null,
      });
    }
  }

  _onDelegationEdit = accountName => {
    this.setState({
      editAccountName: accountName,
    });
  };

  _onDelegationCancel = async accountName => {
    if (await DialogManager.confirm()) {
      this.updateDelegation(accountName, 0);
    }
  };

  _onDelegationEditSave = value => {
    this.updateDelegation(this.state.editAccountName, value);
  };

  _onDelegationEditCancel = () => {
    this.setState({
      editAccountName: null,
    });
  };
}

export default connect(
  state => {
    const myUser = state.user.get('current');
    const myAccount = myUser ? state.global.getIn(['accounts', myUser.get('username')]) : null;

    return {
      myUser,
      myAccount,
      globalProps: state.global.get('props'),
      chainProps: state.global.get('chain_properties'),
    };
  },
  {
    delegate: (operation, receiveInterest, callback) => dispatch =>
      dispatch(
        transaction.actions.broadcastOperation({
          type: receiveInterest
            ? 'delegate_vesting_shares_with_interest'
            : 'delegate_vesting_shares',
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
    fetchChainProperties: () => ({
      type: 'global/FETCH_CHAIN_PROPERTIES',
    }),
    showNotification,
  },
  null,
  { withRef: true }
)(DelegateVestingDialog);
