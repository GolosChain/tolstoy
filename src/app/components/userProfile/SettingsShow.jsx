import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import SplashLoader from 'golos-ui/SplashLoader';
import Card from 'golos-ui/Card';
import { TabContainer, Tabs } from 'golos-ui/Tabs';

import Common from './settings/Common';
import Account from './settings/Account';
import Keys from './settings/Keys';
// import Notifications from './settings/Notifications'; // TODO: uncomment after realize push and email
import Online from './settings/notifications/Online';

export default class SettingsShow extends PureComponent {
    static propTypes = {
        profile: PropTypes.object,
        account: PropTypes.object,

        privateKeys: PropTypes.instanceOf(Map),
        options: PropTypes.instanceOf(Map),
        isFetching: PropTypes.bool,
        isChanging: PropTypes.bool,

        onSubmitBlockchain: PropTypes.func,
        onSubmitGate: PropTypes.func,
        onSubmitChangePassword: PropTypes.func,

        showLogin: PropTypes.func,
        showQRKey: PropTypes.func,
    };

    render() {
        const {
            profile,
            account,

            privateKeys,
            options,
            isFetching,
            isChanging,

            onSubmitBlockchain,
            onSubmitGate,
            onSubmitChangePassword,

            showLogin,
            showQRKey,
        } = this.props;

        return (
            <Card style={{ width: '566px' }}>
                {(!options.size || isFetching) && <SplashLoader />}
                <Tabs activeTab={{ id: 'commonTab' }}>
                    <TabContainer id="commonTab" title="Общие">
                        <Common
                            options={options}
                            isFetching={isFetching}
                            isChanging={isChanging}
                            onSubmitGate={onSubmitGate}
                        />
                    </TabContainer>
                    <TabContainer id="accountTab" title="Учетная запись">
                        <Account
                            profile={profile}
                            account={account}
                            options={options}
                            isFetching={isFetching}
                            isChanging={isChanging}
                            onSubmitBlockchain={onSubmitBlockchain}
                        />
                    </TabContainer>
                    <TabContainer id="notificationsTab" title="Уведомления">
                        <Online
                            options={options}
                            isChanging={isChanging}
                            onSubmitGate={onSubmitGate}
                        />
                        {/* <Notifications
                            options={options}
                            isFetching={isFetching}
                            isChanging={isChanging}
                            onSubmitGate={onSubmitGate}
                        /> */}
                    </TabContainer>
                    <TabContainer id="keysTab" title="Ключи">
                        <Keys
                            account={account}
                            privateKeys={privateKeys}
                            onSubmitChangePassword={onSubmitChangePassword}
                            showLogin={showLogin}
                            showQRKey={showQRKey}
                        />
                    </TabContainer>
                </Tabs>
            </Card>
        );
    }
}
