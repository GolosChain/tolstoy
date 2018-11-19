import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import { List, Map } from 'immutable';
import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';

import { breakWordStyles } from 'src/app/helpers/styles';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { getPropsForInterpolation } from 'src/app/helpers/notifications';
import Icon from 'golos-ui/Icon';

import Avatar from 'src/app/components/common/Avatar';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Follow from 'src/app/components/common/Follow';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    padding: 10px 15px;

    &:first-child {
        padding-top: 15px;
    }
    &:last-child {
        padding-bottom: 15px;
    }
`;

const ActivityDesc = styled.div`
    display: flex;
    flex: 1 0;
    margin-left: 10px;
    max-width: 100%;
    overflow: hidden;

    ${is('isCompact')`
        justify-content: space-between;
    `};
`;

const AuthorName = styled(Link)`
    font-size: 14px;
    font-weight: 500;
    color: #393636;
    text-decoration: none;
`;

const ActivityLeft = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${is('isCompact')`
        justify-content: center;
    `};
`;

const ActivityRight = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;

    ${is('isCompact')`
        flex: 0;
        flex-direction: column;
    `};
`;

const ActivityDate = styled.div`
    margin-left: 10px;
    text-align: right;
    font-size: 12px;
    color: #959595;

    ${is('isSubscribeNotification')`
        margin-left: 0;
    `};
`;

const ActivityText = styled.div`
    color: #959595;
    font-size: 16px;
    font-weight: 300;
    max-width: 100%;
    ${breakWordStyles};

    ${is('isCompact')`
        color: #757575;
    `};

    & a {
        color: #959595;
        font-weight: 500;
        text-decoration: underline;
        max-width: 100%;
        ${breakWordStyles};
    }
`;

const LeftSide = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    margin-left: 6px;
    color: #2879ff;
`;

const FollowWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 0 10px;

    ${is('isCompact')`
        justify-content: flex-end;
        order: 2;
        padding: 0;
        margin-top: 5px;
    `};
`;

const icons = {
    vote: {
        name: 'like',
        size: 14,
    },
    flag: {
        name: 'dislike',
        size: 14,
    },
    transfer: {
        name: 'coins',
        width: 14,
        height: 11,
    },
    reply: {
        name: 'comment',
        size: 12,
    },
    subscribe: {
        name: 'radion-checked',
        size: 14,
    },
    unsubscribe: {
        name: 'round-cross',
        size: 14,
    },
    mention: {
        name: 'round-user',
        size: 14,
    },
    repost: {
        name: 'repost',
        size: 14,
    },
    reward: {
        name: 'coins',
        width: 23,
        height: 18,
    },
    curatorReward: {
        name: 'coins',
        width: 23,
        height: 18,
    },
    witnessVote: null,
    witnessCancelVote: null,
};

const emptyList = List();

export default class ActivityItem extends Component {
    static propTypes = {
        notification: PropTypes.instanceOf(Map),
        isCompact: PropTypes.bool,
    };

    render() {
        const { notification, isCompact } = this.props;
        let leftSide = null;
        let nameLink = null;
        let followBlock = null;

        if (['reward', 'curatorReward'].includes(notification.get('eventType'))) {
            leftSide = (
                <LeftSide>
                    <Icon {...icons[notification.get('eventType')]} />
                </LeftSide>
            );
        }

        const account = notification.getIn(['computed', 'accounts'], emptyList).get(0);
        const isSubscribeNotification = notification.get('eventType') === 'subscribe';
        if (account) {
            const userName = account.get('name');
            const { name, profile_image } = normalizeProfile(account.toJS());

            leftSide = (
                <Link to={`/@${userName}`}>
                    <Avatar
                        avatarUrl={profile_image}
                        size={40}
                        icon={icons[notification.get('eventType')]}
                    />
                </Link>
            );
            nameLink = <AuthorName to={`/@${userName}`}>{name || userName}</AuthorName>;
            followBlock = isSubscribeNotification ? (
                <FollowWrapper isCompact={isCompact}>
                    <Follow following={userName} collapseOnMobile collapse={isCompact} />
                </FollowWrapper>
            ) : null;
        }

        return (
            <Wrapper>
                {leftSide}
                <ActivityDesc isCompact={isCompact}>
                    <ActivityLeft isCompact={isCompact}>
                        {nameLink}
                        <ActivityText isCompact={isCompact}>
                            <Interpolate
                                with={getPropsForInterpolation(notification)}
                                component="div"
                            >
                                {tt(['notifications', 'activity', notification.get('eventType')], {
                                    count: 1,
                                    interpolate: false,
                                })}
                            </Interpolate>
                        </ActivityText>
                    </ActivityLeft>
                    <ActivityRight isCompact={isCompact}>
                        {followBlock}
                        <ActivityDate isSubscribeNotification={isSubscribeNotification}>
                            <TimeAgoWrapper date={notification.get('createdAt')} />
                        </ActivityDate>
                    </ActivityRight>
                </ActivityDesc>
            </Wrapper>
        );
    }
}
