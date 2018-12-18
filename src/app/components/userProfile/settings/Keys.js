import React from 'react';
import tt from 'counterpart';

import { TabContainer, Tabs } from 'golos-ui/Tabs';

import Current from './keys/Current';
import ResetKey from './keys/ResetKey';

const Keys = ({ account, privateKeys, onSubmitChangePassword }) => {
    return (
        <Tabs activeTab={{ id: 'currentKeysTab' }}>
            <TabContainer id="currentKeysTab" title={tt('settings_jsx.keys.tabs.keys')}>
                <Current account={account} privateKeys={privateKeys} />
            </TabContainer>
            <TabContainer id="newKeyTab" title={tt('settings_jsx.keys.tabs.new')}>
                <ResetKey account={account} onSubmitChangePassword={onSubmitChangePassword} />
            </TabContainer>
        </Tabs>
    );
};

export default Keys;
