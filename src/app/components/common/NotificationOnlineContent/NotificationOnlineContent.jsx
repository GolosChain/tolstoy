import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router';
import { List, Map } from 'immutable';

import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';
import normalizeProfile from 'app/utils/NormalizeProfile';

import { breakWordStyles } from 'src/app/helpers/styles';
import { getPropsForInterpolation } from 'src/app/helpers/notifications';

import Avatar from 'src/app/components/common/Avatar';
import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
    width: 100%;
`;

const LeftSide = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    margin-right: 18px;
    color: #2879ff;
`;

const Message = styled.div`
    font-size: 14px;
    line-height: 20px;
    max-width: 100%;

    & > div > a {
        max-width: 100%;
        ${breakWordStyles};
    }
`;

const icons = {
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
};

const emptyList = List();

export default class NotificationOnlineContent extends PureComponent {
    static propTypes = {
        notification: PropTypes.instanceOf(Map),
    };

    render() {
        const { notification } = this.props;

        let leftSide = null;

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
            const { profile_image } = normalizeProfile(account.toJS());

            leftSide = (
                <LeftSide>
                    <Link to={`/@${userName}`}>
                        <Avatar avatarUrl={profile_image} size={40} />
                    </Link>
                </LeftSide>
            );
        }

        return (
            <Wrapper>
                {leftSide}
                <Message>
                    <Interpolate with={getPropsForInterpolation(notification)} component="div">
                        {tt(['notifications', 'online', notification.get('eventType')], {
                            count: 1,
                            interpolate: false,
                        })}
                    </Interpolate>
                </Message>
            </Wrapper>
        );
    }
}
