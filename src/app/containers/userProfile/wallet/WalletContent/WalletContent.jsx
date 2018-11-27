import React, { Component, createRef } from 'react';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import tt from 'counterpart';
import { Helmet } from 'react-helmet';
import { api } from 'golos-js';

import Card from 'golos-ui/Card';

import { APP_DOMAIN, DONATION_FOR } from 'app/client_config';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import { vestsToGolos, vestsToGolosEasy } from 'app/utils/StateFunctions';
import { validateTransferQuery } from 'app/utils/ParsersAndFormatters';
import WalletTabs from 'src/app/components/userProfile/wallet/WalletTabs';
import WalletLine from 'src/app/components/userProfile/wallet/WalletLine';
import PowerDownLine from 'src/app/components/wallet/PowerDownLine';

const DEFAULT_ROWS_LIMIT = 25;
const LOAD_LIMIT = 500;

export const MAIN_TABS = {
    TRANSACTIONS: 'TRANSACTIONS',
    POWER: 'POWER',
    REWARDS: 'REWARDS',
};

export const CURRENCY = {
    ALL: 'ALL',
    GOLOS: 'GOLOS',
    GBG: 'GBG',
    GOLOS_POWER: 'GOLOS_POWER',
    SAFE: 'SAFE',
};

export const CURRENCY_COLOR = {
    GOLOS: '#2879ff',
    GBG: '#ffb839',
    GOLOS_POWER: '#f57c02',
    GOLOS_POWER_DELEGATION: '#78c2d0;',
    IN_SAFE: '#f57c02',
    FROM_SAFE: '#b7b7ba',
};

export const REWARDS_TABS = {
    HISTORY: 'HISTORY',
    STATISTIC: 'STATISTIC',
};

export const REWARDS_TYPES = {
    CURATORIAL: 'CURATORIAL',
    AUTHOR: 'AUTHOR',
};

export const DIRECTION = {
    ALL: 'ALL',
    SENT: 'SENT',
    RECEIVE: 'RECEIVE',
};

const Content = styled.div`
    font-family: Roboto, sans-serif;
`;

const Lines = styled.div``;

const EmptyBlock = styled.div`
    padding: 28px 20px 30px;
    font-size: 20px;
    font-weight: 500;
    color: #c5c5c5;
`;

const EmptySubText = styled.div`
    margin-top: 10px;
    line-height: 1.2em;
    font-size: 18px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    opacity: 0;
    animation: fade-in 0.25s forwards;
    animation-delay: 0.25s;
`;

const Stub = styled.div`
    padding: 20px;
    color: #777;
`;

export default class WalletContent extends Component {
    state = {
        mainTab: this.props.walletTabsState.get('mainTab'),
        currency: this.props.walletTabsState.get('currency'),
        direction: this.props.walletTabsState.get('direction'),
        rewardType: this.props.walletTabsState.get('rewardType'),
        rewardTab: REWARDS_TABS.HISTORY,
        limit: DEFAULT_ROWS_LIMIT,
    };

    contentRef = createRef();

    componentDidMount() {
        this.loadDelegationsData();

        const transferQuery = validateTransferQuery(this.props.location);

        if (transferQuery) {
            this.props.openTransferDialog(transferQuery);
        }

        window.addEventListener('scroll', this.onScrollLazy);
    }

    componentWillUnmount() {
        this._unmount = true;

        window.removeEventListener('scroll', this.onScrollLazy);
    }

    render() {
        const { isOwner, pageAccountName } = this.props;
        const { mainTab, currency, rewardType, direction } = this.state;

        return (
            <Card auto>
                <Helmet title={tt('meta.title.profile.wallet', { name: pageAccountName })} />
                {isOwner && pageAccountName ? (
                    <PowerDownLine accountName={pageAccountName} />
                ) : null}
                <WalletTabs
                    mainTab={mainTab}
                    currency={currency}
                    rewardType={rewardType}
                    direction={direction}
                    onMainTabChange={this.onMainTabChange}
                    onCurrencyChange={this.onCurrencyChange}
                    onRewardTypeChange={this.onRewardTypeChange}
                    onDirectionChange={this.onDirectionChange}
                />
                <Content innerRef={this.contentRef}>{this.renderContent()}</Content>
            </Card>
        );
    }

    renderLoader() {
        return (
            <LoaderWrapper>
                <LoadingIndicator type="circle" size={40} />
            </LoaderWrapper>
        );
    }

    renderContent() {
        const { mainTab, delegationData, delegationError } = this.state;

        if (mainTab === MAIN_TABS.POWER) {
            if (delegationError) {
                return <Stub>{tt('user_wallet.content.failed_load')}</Stub>;
            } else if (!delegationData) {
                return this.renderLoader();
            }
        }

        return this.renderList();
    }

    renderList() {
        const { pageAccount, isOwner, globalProps } = this.props;
        const { mainTab, rewardTab, rewardType } = this.state;

        if (!pageAccount) {
            return this.renderLoader();
        }

        if (mainTab === MAIN_TABS.REWARDS && rewardTab === REWARDS_TABS.STATISTIC) {
            return <EmptyBlock>{tt('user_wallet.content.feature_not_implemented')}</EmptyBlock>;
        }

        let list;

        if (mainTab === MAIN_TABS.POWER) {
            list = this.makeGolosPowerList();
        } else {
            list = this.makeTransferList();
        }

        if (list == null) {
            return this.renderLoader();
        }

        if (list.length) {
            const { myAccountName, myAccount, getContent, postsContent } = this.props;
            const { delegationData } = this.state;

            return (
                <Lines>
                    {list.map((item, i) => (
                        <WalletLine
                            key={i}
                            data={item}
                            myAccountName={myAccountName}
                            account={pageAccount}
                            myAccount={myAccount}
                            delegationData={delegationData}
                            globalProps={globalProps}
                            delegate={this.props.delegate}
                            onLoadDelegationsData={this.onLoadDelegationsData}
                            postsContent={postsContent}
                            getContent={getContent}
                        />
                    ))}
                </Lines>
            );
        } else {
            if (mainTab === MAIN_TABS.REWARDS) {
                if (rewardType === REWARDS_TYPES.AUTHOR) {
                    return (
                        <EmptyBlock>
                            {tt('user_wallet.content.nothing_here_yet')}
                            <EmptySubText>
                                {isOwner
                                    ? tt('user_wallet.content.tip.start_writing')
                                    : tt('user_wallet.content.tip.user_has_no_posts')}
                            </EmptySubText>
                        </EmptyBlock>
                    );
                } else {
                    return (
                        <EmptyBlock>
                            {tt('user_wallet.content.nothing_here_yet')}
                            <EmptySubText>
                                {isOwner
                                    ? tt('user_wallet.content.tip.start_commenting')
                                    : tt('user_wallet.content.tip.user_has_no_comments')}
                            </EmptySubText>
                        </EmptyBlock>
                    );
                }
            }

            return <EmptyBlock>{tt('user_wallet.content.empty_list')}</EmptyBlock>;
        }
    }

    makeTransferList() {
        const { pageAccount, pageAccountName } = this.props;
        const { mainTab, rewardType, limit } = this.state;

        let transactions;

        if (mainTab === MAIN_TABS.REWARDS) {
            const type = rewardType === REWARDS_TYPES.AUTHOR ? 'author' : 'curation';

            transactions = pageAccount.getIn(['rewards', type, 'items']);

            if (!transactions) {
                this.props.loadRewards(pageAccountName, type);
            }
        } else {
            transactions = pageAccount.get('transfer_history');
        }

        if (!transactions) {
            return null;
        }

        const list = [];

        this._hasMore = false;

        for (let i = transactions.size - 1; i >= 0; --i) {
            const item = transactions.get(i);

            const operations = item.get(1);
            const stamp = new Date(operations.get('timestamp') + 'Z');

            const [type, data] = operations.get('op').toJS();

            let line = null;

            if (mainTab === MAIN_TABS.TRANSACTIONS) {
                if (
                    type === 'transfer' ||
                    type === 'transfer_to_savings' ||
                    type === 'transfer_from_savings' ||
                    type === 'transfer_to_vesting'
                ) {
                    line = this.processTransactions(type, data, stamp);
                }
            } else if (mainTab === MAIN_TABS.POWER) {
            } else if (mainTab === MAIN_TABS.REWARDS) {
                if (type === 'curation_reward' || type === 'author_reward') {
                    line = this.processRewards(type, data, stamp);
                }
            }

            if (line) {
                line.stamp = stamp;
                list.push(line);

                if (list.length === limit) {
                    this._hasMore = true;
                    break;
                }
            }
        }

        return list;
    }

    onLoadDelegationsData = () => {
        return this.loadDelegationsData();
    };

    makeGolosPowerList() {
        const { myAccountName, pageAccountName, globalProps } = this.props;
        const { delegationData, direction } = this.state;

        const list = [];

        for (let i = delegationData.length - 1; i >= 0; i--) {
            const item = delegationData[i];
            const isReceive = item.delegatee === pageAccountName;
            const isSent = item.delegator === pageAccountName;

            if (
                direction === DIRECTION.ALL ||
                (direction === DIRECTION.SENT && isSent) ||
                (direction === DIRECTION.RECEIVE && isReceive)
            ) {
                const sign = isReceive ? '+' : '-';

                const amount = vestsToGolos(item.vesting_shares, globalProps);
                const currency = CURRENCY.GOLOS_POWER;

                const stamp = new Date(item.min_delegation_time + 'Z');

                list.push({
                    id: item.id,
                    type: isReceive ? DIRECTION.RECEIVE : DIRECTION.SENT,
                    name: isReceive ? item.delegator : item.delegatee,
                    amount: sign + amount,
                    currency,
                    memo: item.memo || null,
                    icon: 'voice',
                    color: isReceive ? CURRENCY_COLOR.GOLOS_POWER_DELEGATION : null,
                    showDelegationActions: item.delegator === myAccountName,
                    stamp,
                });
            }
        }

        return list;
    }

    async loadDelegationsData() {
        const { pageAccountName } = this.props;

        try {
            const [delegated, received] = await Promise.all([
                api.getVestingDelegationsAsync(pageAccountName, '', LOAD_LIMIT, 'delegated'),
                api.getVestingDelegationsAsync(pageAccountName, '', LOAD_LIMIT, 'received'),
            ]);

            const items = delegated.concat(received);

            for (let item of items) {
                item.id = item.delegator + '%' + item.delegatee;
                item.stamp = new Date(item.min_delegation_time + 'Z');
            }

            items.sort((a, b) => a.stamp - b.stamp);

            if (!this._unmount) {
                this.setState({
                    delegationError: null,
                    delegationData: items,
                });
            }
        } catch (err) {
            console.error(err);

            if (!this._unmount) {
                this.setState({
                    delegationError: err,
                    delegationData: null,
                });
            }
        }
    }

    processTransactions(type, data) {
        const { pageAccountName } = this.props;
        const { currency, direction } = this.state;

        const samePerson = data.to === data.from;
        const isSent = data.from === pageAccountName;
        const isReceive = data.to === pageAccountName && !samePerson;

        const isSafe = type === 'transfer_to_savings' || type === 'transfer_from_savings';

        if (
            direction === DIRECTION.ALL ||
            (direction === DIRECTION.RECEIVE && isReceive) ||
            (direction === DIRECTION.SENT && isSent)
        ) {
            let [amount, opCurrency] = data.amount.split(' ');

            if (type === 'transfer_to_vesting') {
                opCurrency = CURRENCY.GOLOS_POWER;
            }

            if (/^0\.0+$/.test(amount)) {
                return;
            }

            const sign = isReceive || type === 'transfer_from_savings' ? '+' : '-';

            if (
                currency === CURRENCY.ALL ||
                (currency === CURRENCY.SAFE && isSafe) ||
                (currency === opCurrency && !isSafe)
            ) {
                if (type === 'transfer_to_vesting') {
                    const options = {};

                    if (samePerson) {
                        options.title = tt('user_wallet.content.power_up');
                        options.currencies = [
                            {
                                amount: '-' + amount,
                                currency: CURRENCY.GOLOS,
                            },
                            {
                                amount: '+' + amount,
                                currency: CURRENCY.GOLOS_POWER,
                            },
                        ];
                    } else {
                        options.name = samePerson ? null : isReceive ? data.from : data.to;
                        options.amount = sign + amount;
                        options.currency = CURRENCY.GOLOS_POWER;
                    }

                    return {
                        type: isReceive ? DIRECTION.RECEIVE : DIRECTION.SENT,
                        memo: data.memo || null,
                        icon: 'logo',
                        color: '#f57c02',
                        ...options,
                    };
                } else {
                    let memo = data.memo;
                    let memoIconText = null;

                    if (memo) {
                        let donatePostUrl;

                        if (memo.startsWith('{')) {
                            try {
                                const data = JSON.parse(memo);

                                if (data.donate && data.donate.post) {
                                    donatePostUrl = data.donate.post;
                                }
                            } catch (err) {}
                        } else if (memo.startsWith(DONATION_FOR)) {
                            const otherPart = memo.substr(DONATION_FOR.length).trim();

                            if (/^\/[a-z0-9.-]+\/@[a-z0-9.-]+\/[^\s]+$/.test(otherPart)) {
                                donatePostUrl = otherPart;
                            }
                        }

                        if (donatePostUrl) {
                            memo = tt('dialogs_transfer.post_donation', {
                                url: `https://${APP_DOMAIN}${donatePostUrl}`,
                            });
                            memoIconText = tt('user_wallet.content.donate');
                        }
                    }

                    let safeColor = CURRENCY_COLOR.FROM_SAFE;
                    if (isSafe) {
                        if (sign === '+') {
                            safeColor = CURRENCY_COLOR.IN_SAFE;
                        }
                    }

                    return {
                        type: isReceive ? DIRECTION.RECEIVE : DIRECTION.SENT,
                        name: samePerson && isSafe ? null : isReceive ? data.from : data.to,
                        title:
                            samePerson && isSafe
                                ? type === 'transfer_to_savings'
                                    ? tt('user_wallet.content.transfer_to_savings.to')
                                    : tt('user_wallet.content.transfer_to_savings.from')
                                : null,
                        amount: sign + amount,
                        currency: opCurrency,
                        memo: memo || null,
                        memoIconText: memoIconText || null,
                        icon: isSafe
                            ? 'lock'
                            : opCurrency === CURRENCY.GOLOS
                                ? 'logo'
                                : 'brilliant',
                        color: isSafe ? safeColor : isReceive ? CURRENCY_COLOR[opCurrency] : null,
                    };
                }
            }
        }
    }

    processRewards(type, data) {
        const { rewardType } = this.state;

        if (rewardType === REWARDS_TYPES.CURATORIAL && type === 'curation_reward') {
            const amount = vestsToGolosEasy(data.reward);

            if (/^0+\.0+$/.test(amount)) {
                return;
            }

            return {
                type: DIRECTION.RECEIVE,
                post: { author: data.comment_author, permLink: data.comment_permlink },
                amount: '+' + amount,
                currency: CURRENCY.GOLOS_POWER,
                memo: data.memo || null,
                icon: 'k',
                color: '#f57c02',
            };
        } else if (rewardType === REWARDS_TYPES.AUTHOR && type === 'author_reward') {
            const currencies = [];

            const golos = data.steem_payout.split(' ')[0];
            const power = vestsToGolosEasy(data.vesting_payout);
            const gold = data.sbd_payout.split(' ')[0];

            addValueIfNotZero(currencies, golos, CURRENCY.GOLOS);
            addValueIfNotZero(currencies, power, CURRENCY.GOLOS_POWER);
            addValueIfNotZero(currencies, gold, CURRENCY.GBG);

            if (!currencies.length) {
                currencies.push({
                    amount: '0',
                    currency: CURRENCY.GOLOS,
                });
            }

            return {
                type: DIRECTION.RECEIVE,
                post: { author: data.author, permLink: data.permlink },
                currencies,
                memo: data.memo || null,
                icon: 'a',
                color: '#f57c02',
            };
        }
    }

    setTabState(key, id) {
        this.props.setWalletTabState({
            key: key,
            [key]: id,
        });
    }

    setTabsState(id) {
        this.props.setWalletTabsState({
            mainTab: id,
            currency: CURRENCY.ALL,
            direction: DIRECTION.ALL,
            rewardType: REWARDS_TYPES.CURATORIAL,
        });
    }

    onMainTabChange = ({ id }) => {
        this.setTabsState(id);
        this.setState({
            mainTab: id,
            currency: CURRENCY.ALL,
            direction: DIRECTION.ALL,
            rewardType: REWARDS_TYPES.CURATORIAL,
            limit: DEFAULT_ROWS_LIMIT,
        });
    };

    onCurrencyChange = ({ id }) => {
        this.setTabState('currency', id);
        this.setState({
            currency: id,
            limit: DEFAULT_ROWS_LIMIT,
        });
    };

    onDirectionChange = ({ id }) => {
        this.setTabState('direction', id);
        this.setState({
            direction: id,
            limit: DEFAULT_ROWS_LIMIT,
        });
    };

    onRewardTypeChange = ({ id }) => {
        this.setTabState('rewardType', id);
        this.setState({
            rewardType: id,
            limit: DEFAULT_ROWS_LIMIT,
        });
    };

    /*onRewardTabChange = ({ id }) => {
        this.setState({
            rewardTab: id,
            limit: DEFAULT_ROWS_LIMIT,
        });
    };*/

    /*onPostClick = async post => {
        const postData = await api.getContentAsync(post.author, post.permLink, 0);
        browserHistory.push(postData.url);
    };*/

    onScrollLazy = throttle(
        () => {
            if (this._hasMore) {
                if (
                    this.contentRef.current.getBoundingClientRect().bottom <
                    window.innerHeight * 1.2
                ) {
                    this.setState({
                        limit: this.state.limit + DEFAULT_ROWS_LIMIT,
                    });
                }
            }
        },
        100,
        { leading: false }
    );
}

function addValueIfNotZero(list, amount, currency) {
    if (!/^0+\.0+$/.test(amount)) {
        list.push({
            amount,
            currency,
        });
    }
}
