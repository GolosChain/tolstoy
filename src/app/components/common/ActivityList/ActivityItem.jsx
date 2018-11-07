import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import { List, Map } from 'immutable';
import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';

import normalizeProfile from 'app/utils/NormalizeProfile';
import { getPropsForInterpolation } from 'src/app/helpers/notifications';

import Icon from 'golos-ui/Icon';
import Avatar from 'src/app/components/common/Avatar';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

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
    flex: 1;
    flex-direction: column;
    margin-left: 10px;
`;

const AuthorName = styled(Link)`
    font-size: 14px;
    font-weight: 500;
    color: #393636;
    text-decoration: none;
`;

const ActivityTop = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
`;

const ActivityDate = styled.div`
    flex: 1;
    text-align: right;
    font-size: 12px;
    color: #959595;
`;

const ActivityText = styled.div`
    color: #959595;
    font-size: 16px;
    font-weight: 300;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;

    ${is('isCompact')`
        color: #757575;
    `};

    & a {
        color: #959595;
        font-weight: 500;
        text-decoration: underline;
        max-width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
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

        if (['reward', 'curatorReward'].includes(notification.get('eventType'))) {
            leftSide = (
                <LeftSide>
                    <Icon {...icons[notification.get('eventType')]} />
                </LeftSide>
            );
        }

        const account = notification.getIn(['computed', 'accounts'], emptyList).get(0);
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
        }

        return (
            <Wrapper>
                {leftSide}
                <ActivityDesc>
                    <ActivityTop>
                        {nameLink}
                        <ActivityDate>
                            <TimeAgoWrapper date={notification.get('createdAt')} />
                        </ActivityDate>
                    </ActivityTop>
                    <ActivityText isCompact={isCompact}>
                        <Interpolate with={getPropsForInterpolation(notification)} component="div">
                            {tt(['notifications', 'activity', notification.get('eventType')], {
                                count: 1,
                                interpolate: false,
                            })}
                        </Interpolate>
                    </ActivityText>
                </ActivityDesc>
            </Wrapper>
        );
    }
}
