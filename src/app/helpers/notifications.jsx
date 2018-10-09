import React from 'react';
import { Link } from 'react-router';
import { List } from 'immutable';
import tt from 'counterpart';

import { DEBT_TOKEN_SHORT } from 'app/client_config';

const emptyList = List();

const getNotificationRewardsAmount = notification => {
    const rewards = [];
    const golos = notification.getIn(['reward', 'golos'], null);
    const golosPower = notification.getIn(['reward', 'golosPower'], null);
    const gbg = notification.getIn(['reward', 'gbg'], null);
    if (golos) {
        rewards.push(
            `${golos} ${tt('token_names.LIQUID_TOKEN_PLURALIZE', {
                count: parseFloat(golos),
            })}`
        );
    }
    if (golosPower) {
        rewards.push(
            `${golosPower} ${tt('token_names.VESTING_TOKEN_PLURALIZE', {
                count: parseFloat(golosPower),
            })}`
        );
    }
    if (gbg) {
        rewards.push(`${gbg} ${DEBT_TOKEN_SHORT}`);
    }
    return rewards;
};

export const getPropsForInterpolation = notification => {
    const computed = notification.get('computed');
    const eventType = notification.get('eventType');
    const interProps = {};

    // For online notifications if exists
    const account = notification.getIn(['computed', 'accounts'], emptyList).get(0);
    if (account) {
        interProps.user = <Link to={`/@${account.get('name')}`}>@{account.get('name')}</Link>;
    }

    // For activity and online notifications
    if (
        ['vote', 'flag', 'reply', 'mention', 'repost', 'reward', 'curatorReward'].includes(
            eventType
        )
    ) {
        interProps.content = <Link to={computed.get('link')}>{computed.get('title')}</Link>;
    }

    if (eventType === 'reward') {
        const rewards = getNotificationRewardsAmount(notification);
        interProps.amount = rewards.join(', ');
    }

    if (eventType === 'curatorReward') {
        interProps.amount = notification.get('curatorReward');
    }

    if (eventType === 'transfer') {
        interProps.amount = notification.get('amount');
    }

    return interProps;
};
