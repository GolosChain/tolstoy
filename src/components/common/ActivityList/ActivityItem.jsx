import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'mocks/react-router';
import styled from 'styled-components';
import is from 'styled-is';
import { List, Map } from 'immutable';
import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';

import globalBus from 'helpers/globalBus';
import { breakWordStyles } from 'helpers/styles';
import normalizeProfile from 'utils/NormalizeProfile';
import { getPropsForInterpolation } from 'helpers/notifications';
import Icon from 'components/golos-ui/Icon';

import Avatar from 'components/common/Avatar';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import Follow from 'components/common/Follow';

const Wrapper = styled.div`
  padding: 10px 15px;

  &:first-child {
    padding-top: 15px;
  }
  &:last-child {
    padding-bottom: 15px;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
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
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
`;

const ActivityDate = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 9px 0 20px;
  margin-top: -4px;
  margin-right: -8px;
  font-size: 12px;
  color: #959595;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 1)
  );
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

  ${is('withPadding')`
        padding-top: 15px;
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
  flex-shrink: 0;
  align-items: center;
  margin-top: 15px;
  margin-left: 10px;
`;

const AvatarLink = styled(Link)`
  flex-shrink: 0;
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

  root = createRef();

  componentDidMount() {
    if (this.props.checkVisibility) {
      this.checkVisibility();
      globalBus.on('notifications:checkVisibility', this.checkVisibility);
    }
  }

  componentWillUnmount() {
    this.removeVisibilityListener();
  }

  removeVisibilityListener() {
    globalBus.off('notifications:checkVisibility', this.checkVisibility);
  }

  checkVisibility = () => {
    const { notification } = this.props;
    const root = this.root.current;

    const container = root.closest('.js-scroll-container');

    const viewed = root.offsetTop + 10 < container.offsetHeight + container.scrollTop;

    if (viewed) {
      this.removeVisibilityListener();
      this.props.markNotificationAsRead(notification.get('_id'));
    }
  };

  render() {
    const { notification, isCompact } = this.props;
    let leftSide = null;
    let nameLink = null;
    let followBlock = null;
    let rewards = null;

    if (['reward', 'curatorReward'].includes(notification.get('eventType'))) {
      leftSide = (
        <LeftSide>
          <Icon {...icons[notification.get('eventType')]} />
        </LeftSide>
      );
      rewards = true;
    }

    const account = notification.getIn(['computed', 'accounts'], emptyList).get(0);
    const isSubscribeNotification = notification.get('eventType') === 'subscribe';

    if (account) {
      const userName = account.get('name');
      const { name, profile_image } = normalizeProfile(account.toJS());

      leftSide = (
        <AvatarLink to={`/@${userName}`}>
          <Avatar avatarUrl={profile_image} size={40} icon={icons[notification.get('eventType')]} />
        </AvatarLink>
      );
      nameLink = <AuthorName to={`/@${userName}`}>{name || userName}</AuthorName>;
      followBlock = isSubscribeNotification ? (
        <FollowWrapper isCompact={isCompact}>
          <Follow following={userName} collapseOnMobile collapse={isCompact} />
        </FollowWrapper>
      ) : null;
    }

    return (
      <Wrapper ref={this.root}>
        <Content>
          {leftSide}
          <ActivityDesc isCompact={isCompact}>
            <ActivityLeft>
              {nameLink}
              <ActivityText isCompact={isCompact} withPadding={rewards}>
                <Interpolate with={getPropsForInterpolation(notification)} component="div">
                  {tt(['notifications', 'activity', notification.get('eventType')], {
                    count: 1,
                    interpolate: false,
                  })}
                </Interpolate>
              </ActivityText>
            </ActivityLeft>
            {followBlock}
            <ActivityDate>
              <TimeAgoWrapper date={notification.get('createdAt')} />
            </ActivityDate>
          </ActivityDesc>
        </Content>
      </Wrapper>
    );
  }
}
