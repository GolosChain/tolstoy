import React from 'react';
import { Link } from 'react-router';
import { List } from 'immutable';
import { pathOr } from 'ramda';
import tt from 'counterpart';

import { DEBT_TOKEN_SHORT } from 'app/client_config';

const emptyList = List();

export const getPropsForInterpolation = notification => {
    const computed = notification.get('computed');
    const eventType = notification.get('eventType');
    const interProps = {};

    // For online notifications
    const account = notification.getIn(['computed', 'accounts'], emptyList).get(0);
    if (account) {
        const userName = account.get('name');
        interProps.user = <Link to={`/@${userName}`}>@{userName}</Link>;
    }

    if (
        ['vote', 'flag', 'reply', 'mention', 'repost', 'reward', 'curatorReward'].includes(
            eventType
        )
    ) {
        interProps.content = <Link to={computed.get('link')}>{computed.get('title')}</Link>;
    }

    if (['reward'].includes(eventType)) {
        const awards = [];
        const golos = notification.getIn(['reward', 'golos'], null);
        const golosPower = notification.getIn(['reward', 'golosPower'], null);
        const gbg = notification.getIn(['reward', 'gbg'], null);
        if (golos) {
            awards.push(
                `${golos} ${tt('token_names.LIQUID_TOKEN_PLURALIZE', {
                    count: parseFloat(golos),
                })}`
            );
        }
        if (golosPower) {
            awards.push(
                `${golosPower} ${tt('token_names.VESTING_TOKEN_PLURALIZE', {
                    count: parseFloat(golosPower),
                })}`
            );
        }
        if (gbg) {
            awards.push(`${gbg} ${DEBT_TOKEN_SHORT}`);
        }
        interProps.content = <Link to={computed.get('link')}>{computed.get('title')}</Link>;
        interProps.amount = awards.join(', ');
    }

    if (['curatorReward'].includes(eventType)) {
        interProps.content = <Link to={computed.get('link')}>{computed.get('title')}</Link>; // online
        interProps.amount = notification.get('curatorReward');
    }

    if (['transfer'].includes(eventType)) {
        interProps.amount = notification.get('amount');
    }

    return interProps;
};
