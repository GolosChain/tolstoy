import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import { MODAL_CONFIRM } from 'store/constants/modalTypes';
import { saveAuth } from 'utils/localStore';
import DialogManager from 'components/elements/common/DialogManager';
import { translateError } from 'utils/ParsersAndFormatters';
import Button from 'components/golos-ui/Button';
import Icon from 'components/golos-ui/Icon';
import { logOpenDialogAnalytics } from 'helpers/gaLogs';

const WIF_LENGTH = 52;
const OWNER_KEY_OPERATIONS = [
  'recover_account',
  'change_recovery_account',
  'decline_voting_rights',
  'set_reset_account',
];

const Wrapper = styled.div`
  max-width: 90vw;
  min-width: 460px;

  position: relative;
  padding: 20px 30px;
  font: 14px Roboto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: 500px) {
    width: 100%;
    margin: 10px;
    min-width: 300px;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 22px;
  right: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
  margin: -6px;
  color: #e1e1e1;

  &:hover {
    color: #b9b9b9;
  }
`;

const Title = styled.h1`
  width: 100%;
  padding: 4px 12px;
  margin-bottom: 20px;
  text-align: center;
  color: #393636;
  font-size: 24px;
  font-weight: 900;
  line-height: 32px;
`;

const Form = styled.form`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const ErrorBlock = styled.div`
  min-height: 30px;
  padding: 6px 0;
  line-height: 16px;
  font-size: 12px;
  color: #fc5d16;
`;

const LoginBlock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  border-radius: 6px;
  border: solid 1px #e1e1e1;
`;

const LoginLabel = styled.div`
  width: 30px;
  line-height: 26px;
  border-right: solid 1px #e1e1e1;
  font-weight: 500;
  text-align: center;

  &::after {
    content: '@';
    color: #bebebe;
  }
`;

const Input = styled.input`
  padding: 0 12px;
  font-size: 14px;
  color: #393636;
  outline: none;
  box-shadow: none !important;
  -webkit-appearance: none;
`;

const LoginInput = styled(Input)`
  flex: 1;
  border: none;
  border-radius: 0 5px 5px 0;
  background: transparent;
`;

const PasswordInput = styled(Input)`
  height: 30px;
  width: 100%;
  border-radius: 6px;
  border: solid 1px #e1e1e1;
`;

const LoginButton = styled(Button)`
  width: 170px;
  align-self: center;
  margin-bottom: 0;
`;

const OwnerLoginWarning = styled(ErrorBlock)`
  max-width: 400px;
  font-size: 16px;
  line-height: 1.2rem;
`;

export class LoginForm extends Component {
  static propTypes = {
    currentUsername: PropTypes.string,
    username: PropTypes.string,
    authType: PropTypes.oneOf(['owner', 'active', 'memo']),
    isConfirm: PropTypes.bool,
    forceSave: PropTypes.bool,
    operationType: PropTypes.string,
    loginOperation: PropTypes.object,
    strictAuthType: PropTypes.bool,
    loginError: PropTypes.string,
    loginCanceled: PropTypes.func.isRequired,
    login: PropTypes.func,
    onClose: PropTypes.func,
  };

  state = {
    username: this.getUsernameFromProps(),
    password: '',
    submitting: false,
    activeConfirmed: false,
  };

  componentDidMount() {
    this.logEventAnalytics();
  }

  logEventAnalytics() {
    const { isConfirm } = this.props;
    if (!isConfirm) {
      logOpenDialogAnalytics('Sign in dialog');
    }
  }

  getUsernameFromProps() {
    const { isConfirm, currentUsername, username, operationType } = this.props;

    const name = username || currentUsername;

    if (!name) {
      return '';
    }

    let stateUsername = name;

    if (isConfirm && name && !name.includes('/')) {
      let needKeyType = 'active';

      if (operationType && OWNER_KEY_OPERATIONS.includes(operationType)) {
        needKeyType = 'owner';
      }

      stateUsername += `/${needKeyType}`;
    }

    return stateUsername;
  }

  confirmClose = () => {
    this.props.loginCanceled();
    return true;
  };

  submit = async () => {
    const { login, isConfirm, onClose } = this.props;
    const { username, password, activeConfirmed } = this.state;

    if (
      !isConfirm &&
      !activeConfirmed &&
      password.startsWith('P') &&
      password.length === WIF_LENGTH
    ) {
      const result = await DialogManager.confirm(tt('loginform_jsx.password_warning'), {
        width: 460,
      });

      if (!result) {
        return;
      }

      this.setState({
        activeConfirmed: true,
      });
    }

    this.setState({
      loginError: null,
    });

    try {
      const auth = await login(username, password);
      if (auth) {
        saveAuth(username, password);
      }

      onClose({ status: MODAL_CONFIRM });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      this.setState({
        loginError: err,
      });
    }
  };

  onFormSubmit = e => {
    e.preventDefault();

    const { submitting } = this.state;

    if (submitting) {
      return;
    }

    this.submit();
  };

  clearError = () => {
    if (this.props.loginError) {
      this.props.clearError();
    }
  };

  onCrossClick = () => {
    this.props.loginCanceled();
    this.props.onClose();
  };

  onLoginChange = e => {
    this.setState({
      username: e.target.value,
    });

    this.clearError();
  };

  onPasswordChange = e => {
    this.setState({
      password: e.target.value,
    });

    this.clearError();
  };

  onResetKeysClick = () => {
    const { username, password } = this.state;
    this.props.openResetKeysDialog(username, password);
    this.onCrossClick();
  };

  render() {
    const { onClose, loginError, isConfirm, forceSave, operationType, className } = this.props;
    const { username, password, submitting } = this.state;

    let loginErr = null;
    let passwordErr = null;
    let isLoginByOwnerKey = false;

    const lockUsername = isConfirm && username;

    if (loginError) {
      if (loginError === 'Incorrect Password') {
        passwordErr = tt('g.incorrect_password');
      } else if (loginError === 'active_login_blocked') {
        passwordErr = tt('loginform_jsx.active_key_error');
      } else if (loginError === 'owner_login_blocked') {
        isLoginByOwnerKey = true;
      } else {
        loginErr = translateError(loginError);
      }
    }

    let needKeyType = null;

    if (isConfirm) {
      needKeyType = 'active';

      if (operationType && OWNER_KEY_OPERATIONS.includes(operationType)) {
        needKeyType = 'owner';
      }
    }

    return (
      <Wrapper className={className}>
        {onClose ? (
          <CloseButton onClick={this.onCrossClick}>
            <Icon name="cross_thin" width={16} height={16} />
          </CloseButton>
        ) : null}
        <Form onSubmit={this.onFormSubmit}>
          <Title>{isConfirm ? tt('loginform_jsx.authorize_for') : tt('g.login')}</Title>
          <LoginBlock>
            <LoginLabel />
            <LoginInput
              placeholder={tt('loginform_jsx.enter_your_username')}
              autoCapitalize="no"
              autoCorrect="off"
              spellCheck="false"
              readOnly={submitting || lockUsername}
              required
              value={username}
              onChange={this.onLoginChange}
            />
          </LoginBlock>
          <ErrorBlock>{loginErr}</ErrorBlock>
          <PasswordInput
            type="password"
            placeholder={
              isConfirm
                ? needKeyType === 'owner'
                  ? tt('loginform_jsx.password_or_owner')
                  : tt('loginform_jsx.password_or_active')
                : tt('loginform_jsx.password_or_posting')
            }
            required
            disabled={submitting}
            value={password}
            onChange={this.onPasswordChange}
          />
          <ErrorBlock>{passwordErr}</ErrorBlock>
          {isLoginByOwnerKey && (
            <OwnerLoginWarning>
              <p>{tt('loginform_jsx.login_by_owner_key.first')}</p>
              <p>
                {tt('loginform_jsx.login_by_owner_key.second')}{' '}
                <a onClick={this.onResetKeysClick}>
                  {tt('loginform_jsx.login_by_owner_key.reset_keys')}
                </a>{' '}
                {tt('loginform_jsx.login_by_owner_key.third')}
              </p>
            </OwnerLoginWarning>
          )}
          <LoginButton type="submit" disabled={submitting || isLoginByOwnerKey}>
            {isConfirm ? tt('g.authorize') : tt('g.login')}
          </LoginButton>
        </Form>
      </Wrapper>
    );
  }
}
