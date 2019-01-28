import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { TabContainer, Tabs } from 'golos-ui/Tabs';
import { CardContent } from 'golos-ui/Card';
import {
    MAIN_TABS,
    CURRENCY,
    DIRECTION,
    REWARDS_TYPES,
} from 'src/app/containers/userProfile/wallet/WalletContent/WalletContent';

const CardContentStyled = styled(CardContent)`
    display: block;
    padding: 0;
`;

const TabsContent = styled.div``;

export default class WalletTabs extends PureComponent {
    render() {
        const { mainTab } = this.props;

        return (
            <Tabs activeTab={{ id: mainTab }} onChange={this.props.onMainTabChange}>
                <CardContentStyled>
                    <TabContainer
                        id={MAIN_TABS.TRANSACTIONS}
                        title={tt('user_wallet.tab_title.transaction_history')}
                    >
                        {this.renderTransactionsTabs()}
                    </TabContainer>
                    <TabContainer
                        id={MAIN_TABS.POWER}
                        title={tt('user_wallet.tab_title.delegation')}
                    >
                        {this.renderTransactionsType()}
                    </TabContainer>
                    <TabContainer
                        id={MAIN_TABS.REWARDS}
                        title={tt('user_wallet.tab_title.rewards')}
                    >
                        {this.renderRewardsTabs()}
                    </TabContainer>
                </CardContentStyled>
            </Tabs>
        );
    }

    renderTransactionsTabs() {
        const { currency } = this.props;

        const innerTabs = this.renderTransactionsType();

        return (
            <Tabs activeTab={{ id: currency }} onChange={this.props.onCurrencyChange}>
                <TabsContent>
                    <TabContainer id={CURRENCY.ALL} title={tt('user_wallet.tab_title.all')}>
                        {innerTabs}
                    </TabContainer>
                    <TabContainer id={CURRENCY.GOLOS} title={tt('user_wallet.tab_title.golos')}>
                        {innerTabs}
                    </TabContainer>
                    <TabContainer id={CURRENCY.GBG} title={tt('user_wallet.tab_title.gbg')}>
                        {innerTabs}
                    </TabContainer>
                    <TabContainer
                        id={CURRENCY.GOLOS_POWER}
                        title={tt('user_wallet.tab_title.golos_power')}
                    >
                        {innerTabs}
                    </TabContainer>
                    <TabContainer id={CURRENCY.SAFE} title={tt('user_wallet.tab_title.savings')}>
                        {innerTabs}
                    </TabContainer>
                </TabsContent>
            </Tabs>
        );
    }

    renderRewardsTabs() {
        return this.renderRewardsType();

        // const { rewardTab } = this.props;
        //
        // return (
        //     <Tabs activeTab={{ id: rewardTab }} onChange={this.props.onRewardTabChange}>
        //         <TabsContent>
        //             <TabContainer id={REWARDS_TABS.HISTORY} title="История">
        //                 {this.renderRewardsType()}
        //             </TabContainer>
        //             <TabContainer id={REWARDS_TABS.STATISTIC} title="Статистика">
        //                 {this.renderRewardsType()}
        //             </TabContainer>
        //         </TabsContent>
        //     </Tabs>
        // );
    }

    renderRewardsType() {
        const { rewardType } = this.props;

        return (
            <Tabs activeTab={{ id: rewardType }} onChange={this.props.onRewardTypeChange}>
                <TabsContent>
                    <TabContainer
                        id={REWARDS_TYPES.CURATORIAL}
                        title={tt('user_wallet.tab_title.curation_rewards')}
                    />
                    <TabContainer
                        id={REWARDS_TYPES.AUTHOR}
                        title={tt('user_wallet.tab_title.author_rewards')}
                    />
                    <TabContainer
                        id={REWARDS_TYPES.DELEGATION}
                        title={tt('user_wallet.tab_title.delegation_rewards')}
                    />
                </TabsContent>
            </Tabs>
        );
    }

    renderTransactionsType() {
        const { direction } = this.props;

        return (
            <Tabs activeTab={{ id: direction }} onChange={this.props.onDirectionChange}>
                <TabsContent>
                    <TabContainer id={DIRECTION.ALL} title={tt('user_wallet.tab_title.all')} />
                    <TabContainer id={DIRECTION.SENT} title={tt('user_wallet.tab_title.sent')} />
                    <TabContainer
                        id={DIRECTION.RECEIVE}
                        title={tt('user_wallet.tab_title.received')}
                    />
                </TabsContent>
            </Tabs>
        );
    }
}
