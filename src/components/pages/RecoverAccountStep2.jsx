import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import { api } from 'mocks/golos-js';

import GeneratedPasswordInput from 'components/elements/GeneratedPasswordInput';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import Callout from 'components/elements/Callout';
import { passwordToOwnerPubKey } from './RecoverAccountStep1';

class RecoverAccountStep2 extends React.Component {
  static propTypes = {
    account_to_recover: PropTypes.string,
    recoverAccount: PropTypes.func.isRequired,
  };

  state = {
    name_error: '',
    oldPassword: '',
    newPassword: '',
    valid: false,
    error: '',
    progress_status: '',
    success: false,
  };

  oldPasswordChange = e => {
    const oldPassword = e.target.value.trim();
    this.setState({ oldPassword });
  };

  onPasswordChange = (newPassword, valid) => {
    this.setState({ newPassword, valid });
  };

  onRecoverFailed = error => {
    this.setState({
      error: error.msg || error.toString(),
      progress_status: '',
    });
  };

  onRecoverSuccess = () => {
    this.setState({
      success: true,
      progress_status: '',
    });
  };

  async checkOldOwner(name, oldOwner) {
    const history = await api.getOwnerHistoryAsync(name);

    return history.some(a => a.previous_owner_authority.key_auths[0][0] === oldOwner);
  }

  async requestAccountRecovery(name, oldPassword, newPassword) {
    const old_owner_key = passwordToOwnerPubKey(name, oldPassword);
    const new_owner_key = passwordToOwnerPubKey(name, newPassword);
    const new_owner_authority = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[new_owner_key, 1]],
    };

    try {
      const r = await fetch('/api/v1/request_account_recovery', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          csrf: $STM_csrf,
          name,
          old_owner_key,
          new_owner_key,
          new_owner_authority,
        }),
      });

      const res = await r.json();

      if (res.error) {
        console.error('request_account_recovery server error (1)', res.error);
        this.setState({ error: res.error || tt('g.unknown'), progress_status: '' });
        return;
      }

      this.setState({
        error: '',
        progress_status: tt('recoveraccountstep1_jsx.recovering_account') + '..',
      });

      this.props.recoverAccount(
        name,
        oldPassword,
        newPassword,
        this.onRecoverFailed,
        this.onRecoverSuccess
      );
    } catch (err) {
      console.error('request_account_recovery server error (2)', err);
      this.setState({
        error: err.message ? err.message : err,
        progress_status: '',
      });
    }
  }

  onSubmit = async e => {
    e.preventDefault();
    const { oldPassword, newPassword } = this.state;
    const name = this.props.account_to_recover;
    const oldOwner = passwordToOwnerPubKey(name, oldPassword);

    this.setState({
      progress_status: tt('recoveraccountstep1_jsx.checking_account_owner') + '..',
    });

    const res = await this.checkOldOwner(name, oldOwner);

    if (res) {
      this.setState({
        progress_status: tt('recoveraccountstep1_jsx.sending_recovery_request') + '..',
      });
      this.requestAccountRecovery(name, oldPassword, newPassword);
    } else {
      this.setState({
        error: tt('recoveraccountstep1_jsx.cant_confirm_account_ownership'),
        progress_status: '',
      });
    }
  };

  renderSubmitButton() {
    const { oldPassword, valid, progress_status } = this.state;

    if (progress_status) {
      return (
        <span>
          <LoadingIndicator type="circle" inline /> {progress_status}
        </span>
      );
    }

    return (
      <input
        disabled={!valid}
        type="submit"
        className={'button action' + (!valid || !oldPassword ? ' disabled' : '')}
        value={tt('g.submit')}
      />
    );
  }

  render() {
    if (!process.env.BROWSER) {
      return (
        <div className="row">
          <div className="column">
            {tt('g.loading')}
            ...
          </div>
        </div>
      );
    }

    const { account_to_recover } = this.props;

    if (!account_to_recover) {
      return (
        <Callout type="error">
          <span>{tt('recoveraccountstep1_jsx.account_recovery_request_not_confirmed')}</span>
        </Callout>
      );
    }

    const { oldPassword, error, progress_status, name_error, success } = this.state;

    if (!progress_status && success) {
      window.location = `/login#account=${account_to_recover}&msg=accountrecovered`;
      return null;
    }

    const disable_password_input = success || progress_status !== '';

    return (
      <div style={{ margin: '30px 0 50px' }}>
        <div className="row">
          <div className="column large-6">
            <h2>{tt('recoveraccountstep1_jsx.recover_account')}</h2>
            <form onSubmit={this.onSubmit} autoComplete="off" noValidate>
              <div className={name_error ? 'error' : ''}>
                <label>
                  {tt('g.account_name')}
                  <input
                    type="text"
                    disabled="true"
                    autoComplete="off"
                    value={account_to_recover}
                  />
                </label>
                <p className="help-text">{name_error}</p>
              </div>
              <br />
              <div>
                <label>
                  {tt('g.recent_password')}
                  <input
                    type="password"
                    disabled={disable_password_input}
                    autoComplete="off"
                    value={oldPassword}
                    onChange={this.oldPasswordChange}
                  />
                </label>
              </div>
              <br />
              <GeneratedPasswordInput
                onChange={this.onPasswordChange}
                disabled={disable_password_input}
                showPasswordString={oldPassword.length > 0}
              />
              <div className="error">{error}</div>
              <br />
              {this.renderSubmitButton()}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const ConnectedComponent = connect(
  state => ({
    account_to_recover: state.offchain.get('recover_account'),
  }),
  dispatch => ({
    recoverAccount: (account_to_recover, old_password, new_password, onError, onSuccess) => {
      dispatch({
        type: 'transaction/RECOVER_ACCOUNT',
        payload: { account_to_recover, old_password, new_password, onError, onSuccess },
      });
      dispatch({ type: 'user/LOGOUT' });
    },
  })
)(RecoverAccountStep2);

export default {
  path: 'recover_account_step_2',
  component: ConnectedComponent,
};
