import React from 'react';
import tt from 'counterpart';
import { api } from 'mocks/golos-js';
import { PrivateKey } from 'golos-js/lib/auth/ecc';

import { APP_NAME, APP_DOMAIN, SUPPORT_EMAIL } from 'src/constants/config';
import SvgImage from 'src/components/elements/SvgImage';
import PasswordInput from 'src/components/elements/PasswordInput';
import LoadingIndicator from 'src/components/elements/LoadingIndicator';
import constants from 'src/store/constants';
import { fixDate } from 'src/helpers/time';

export function passwordToOwnerPubKey(account_name, password) {
  let privateKey;

  try {
    privateKey = PrivateKey.fromWif(password);
  } catch (err) {
    privateKey = PrivateKey.fromSeed(account_name + 'owner' + password);
  }

  return privateKey.toPublicKey().toString();
}

class RecoverAccountStep1 extends React.Component {
  state = {
    name: '',
    name_error: '',
    email: '',
    email_error: '',
    error: '',
    progress_status: '',
    password: { value: '', valid: false },
    show_social_login: '',
    email_submitted: false,
  };

  onNameChange = e => {
    const name = e.target.value.trim().toLowerCase();
    this.validateAccountName(name);
    this.setState({ name, error: '' });
  };

  onEmailChange = e => {
    const email = e.target.value.trim().toLowerCase();
    let email_error = '';

    if (!/^[^@]+@[^.]+\.[^@]+$/.test(email)) {
      email_error = tt('recoveraccountstep1_jsx.not_valid');
    }

    this.setState({ email, email_error });
  };

  async validateAccountName(name) {
    if (!name) {
      return;
    }

    const res = await api.getAccountsAsync([name]);

    if (!res || res.length === 0) {
      this.setState({
        name_error: tt('recoveraccountstep1_jsx.account_name_is_not_found'),
      });
      return;
    }

    this.setState({
      name_error: '',
    });

    const [account] = res;

    const ownerUpdate = fixDate(account.last_owner_update);

    const ownerUpdateTime = new Date(ownerUpdate).getTime();
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    if (ownerUpdateTime < Math.max(monthAgo, constants.JULY_14_HACK)) {
      this.setState({
        name_error: tt('recoveraccountstep1_jsx.unable_to_recover_account'),
      });
    }
  }

  async validateAccountOwner(name) {
    const oldOwner = passwordToOwnerPubKey(name, this.state.password.value);

    const history = await api.getOwnerHistoryAsync(name);

    return history.some(a => a.previous_owner_authority.key_auths[0][0] === oldOwner);
  }

  async getAccountIdentityProviders(name, owner_key) {
    const r = await fetch('/api/v1/account_identity_providers', {
      method: 'post',
      mode: 'no-cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ csrf: $STM_csrf, name, owner_key }),
    });

    const res = await r.json();

    return res.error ? 'email' : res.provider;
  }

  onPasswordsChange = ({ oldPassword, valid }) => {
    this.setState({
      password: {
        value: oldPassword,
        valid,
      },
      error: '',
    });
  };

  onSubmit = async e => {
    e.preventDefault();
    const owner_key = passwordToOwnerPubKey(this.state.name, this.state.password.value);
    const result = await this.validateAccountOwner(this.state.name);

    if (result) {
      const provider = await this.getAccountIdentityProviders(this.state.name, owner_key);

      this.setState({ show_social_login: provider });
    } else {
      this.setState({
        error: tt('recoveraccountstep1_jsx.password_not_used_in_last_days'),
      });
    }
  };

  onSubmitEmail = async e => {
    e.preventDefault();

    const { name, password } = this.state;
    const owner_key = passwordToOwnerPubKey(name, password.value);

    try {
      const r = await fetch('/api/v1/initiate_account_recovery_with_email', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          csrf: $STM_csrf,
          contact_email: this.state.email,
          account_name: name,
          owner_key,
        }),
      });

      const res = await r.json();

      if (res.error) {
        this.setState({ email_error: res.error || 'Unknown' });
        return;
      }

      switch (res.status) {
        case 'ok':
          this.setState({ email_submitted: true });
          break;
        case 'duplicate':
          this.setState({
            email_error: tt('recoveraccountstep1_jsx.request_already_submitted_contact_support', {
              SUPPORT_EMAIL,
            }),
          });
          break;
      }
    } catch (err) {
      console.error('request_account_recovery server error (2)', err);
      this.setState({
        email_error: err.message ? err.message : err,
      });
    }
  };

  renderEmailPart() {
    const { email, email_error, email_submitted } = this.state;

    return (
      <div className="row">
        <div className="column large-4">
          {email_submitted ? (
            <div>
              <p>
                {tt('recoveraccountstep1_jsx.report_line_1', {
                  APP_NAME,
                })}
              </p>
              <p>{tt('recoveraccountstep1_jsx.report_line_2')}</p>
              <p>{tt('recoveraccountstep1_jsx.report_line_3')}</p>
            </div>
          ) : (
            <form onSubmit={this.onSubmitEmail} noValidate>
              <p>{tt('recoveraccountstep1_jsx.enter_email_toverify_identity')}</p>
              <div className={`column large-4 shrink ${email_error ? 'error' : ''}`}>
                <label>
                  {tt('g.email')}
                  <input
                    type="text"
                    name="email"
                    autoComplete="off"
                    onChange={this.onEmailChange}
                    value={email}
                  />
                </label>
                <p className="error">{email_error}</p>
                <input
                  type="submit"
                  disabled={email_error || !email}
                  className="button hollow"
                  value={tt('recoveraccountstep1_jsx.continue_with_email')}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  renderOtherPart() {
    const { name, password, show_social_login } = this.state;

    const ownerKey = passwordToOwnerPubKey(name, password.value);

    return (
      <form action="/initiate_account_recovery" method="post">
        <input type="hidden" name="csrf" value={$STM_csrf} />
        <input type="hidden" name="account_name" value={name} />
        <input type="hidden" name="owner_key" value={ownerKey} />
        <div className="row">&nbsp;</div>
        {(show_social_login === 'both' || show_social_login === 'facebook') && (
          <div className="row">
            <div className="column large-4 shrink">
              <SvgImage name="facebook" width="64px" height="64px" />
            </div>
            <div className="column large-8">
              <input
                type="submit"
                name="provider"
                value="facebook"
                className="button SignUp--fb-button"
              />
            </div>
          </div>
        )}
        <div className="row">&nbsp;</div>
        {(show_social_login === 'both' || show_social_login === 'reddit') && (
          <div className="row">
            <div className="column large-4 shrink">
              <SvgImage name="reddit" width="64px" height="64px" />
            </div>
            <div className="column large-8">
              <input
                type="submit"
                name="provider"
                value="reddit"
                className="button SignUp--reddit-button"
              />
            </div>
          </div>
        )}
        <div className="row">
          <div className="column">&nbsp;</div>
        </div>
      </form>
    );
  }

  render() {
    const {
      name,
      name_error,
      error,
      progress_status,
      password,
      show_social_login,
      email_submitted,
    } = this.state;

    const valid = name && !name_error && password.valid;
    const show_account_and_passwords = !email_submitted && !show_social_login;

    return (
      <div style={{ margin: '30px 0 50px' }}>
        {show_account_and_passwords && (
          <div className="row">
            <div className="column large-4">
              <h2>{tt('navigation.stolen_account_recovery')}</h2>
              <p>
                {tt('recoveraccountstep1_jsx.recover_account_intro', {
                  APP_NAME,
                  APP_URL: APP_DOMAIN,
                })}
              </p>
              <form onSubmit={this.onSubmit} noValidate>
                <div className={name_error ? 'error' : ''}>
                  <label>
                    {tt('g.account_name')}
                    <input
                      type="text"
                      name="name"
                      autoComplete="off"
                      onChange={this.onNameChange}
                      value={name}
                    />
                  </label>
                  <p className="error">{name_error}</p>
                </div>
                <PasswordInput
                  passwordLabel={tt('g.recent_password')}
                  onChange={this.onPasswordsChange}
                />
                <br />
                <div className="error">{error}</div>
                {progress_status ? (
                  <span>
                    <LoadingIndicator type="circle" inline /> {progress_status}
                  </span>
                ) : (
                  <input
                    disabled={!valid}
                    type="submit"
                    className={'button action' + (!valid ? ' disabled' : '')}
                    value={tt('voting_jsx.begin_recovery')}
                  />
                )}
              </form>
            </div>
          </div>
        )}

        {!show_social_login
          ? null
          : show_social_login === 'email'
          ? this.renderEmailPart()
          : this.renderOtherPart()}
      </div>
    );
  }
}

export default {
  path: 'recover_account_step_1',
  component: RecoverAccountStep1,
};
