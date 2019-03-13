import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Helmet } from 'react-helmet';
import { FORM_ERROR } from 'final-form';
import { pick } from 'ramda';
import tt from 'counterpart';

import { SettingsShow } from 'src/app/components/userProfile';

export default class SettingsContent extends PureComponent {
  static propTypes = {
    account: PropTypes.object,
    profile: PropTypes.object,

    privateKeys: PropTypes.instanceOf(Map),
    options: PropTypes.instanceOf(Map),
    isFetching: PropTypes.bool,
    isChanging: PropTypes.bool,
    updateAccount: PropTypes.func,

    changePassword: PropTypes.func,

    getSettingsOptions: PropTypes.func,
  };

  componentDidMount() {
    this.props.getSettingsOptions();
  }

  onSubmitBlockchain = values => {
    const { account, metaData, updateAccount, notify } = this.props;

    metaData.profile = pick(
      ['profile_image', 'cover_image', 'name', 'about', 'gender', 'location', 'website', 'social'],
      values
    );

    return new Promise((resolve, reject) => {
      updateAccount({
        json_metadata: JSON.stringify(metaData),
        account: account.get('name'),
        memo_key: account.get('memo_key'),
        successCallback: () => {
          notify(tt('g.saved'));
          resolve();
        },
        errorCallback: e => {
          if (e === 'Canceled') {
            resolve();
          } else {
            console.log('updateAccount ERROR:', e);
            reject({
              [FORM_ERROR]: e,
            });
          }
        },
      });
    });
  };

  onSubmitGate = values => {
    const { setSettingsOptions, notify } = this.props;
    return new Promise((resolve, reject) => {
      setSettingsOptions({
        ...values,
        successCallback: () => {
          notify(tt('g.saved'));
          resolve();
        },
        errorCallback: e => {
          if (e === 'Canceled') {
            resolve();
          } else {
            console.log('setSettingsOptions ERROR:', e);
            reject({
              [FORM_ERROR]: e,
            });
          }
        },
      });
    });
  };

  render() {
    const { profile, account, options, privateKeys, isFetching, isChanging, isRich } = this.props;

    return (
      <Fragment>
        <Helmet title={tt('meta.title.profile.settings', { name: account.get('name') })} />
        <SettingsShow
          profile={profile}
          account={account}
          privateKeys={privateKeys}
          options={options}
          isRich={isRich}
          isFetching={isFetching}
          isChanging={isChanging}
          onSubmitBlockchain={this.onSubmitBlockchain}
          onSubmitGate={this.onSubmitGate}
        />
      </Fragment>
    );
  }
}
