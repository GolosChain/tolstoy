import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';
import tt from 'counterpart';
import { Helmet } from 'react-helmet';
import throttle from 'lodash/throttle';

import { NOTIFICATIONS_FILTER_TYPES, NOTIFICATIONS_PER_PAGE } from 'app/redux/constants/common';

import Card from 'golos-ui/Card';
import { TabContainer, Tabs } from 'golos-ui/Tabs';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import ActivityList from 'components/common/ActivityList';
import Flex from 'golos-ui/Flex';
import { visuallyHidden } from 'helpers/styles';

const WrapperLoader = styled.div`
  display: flex;
  justify-content: center;
  height: 80px;
  padding-top: 20px;
`;

const CardContent = styled(Flex)``;

const Header = styled.h1`
  ${visuallyHidden};
`;

export default class ActivityContent extends PureComponent {
  static propTypes = {
    isFetching: PropTypes.bool,
    currentTabId: PropTypes.string,
    notifications: PropTypes.instanceOf(List),
    pageAccountName: PropTypes.string,

    changeProfileActivityTab: PropTypes.func,
    getNotificationsHistory: PropTypes.func,
  };

  rootRef = null;

  lastNotificationId = null;

  componentDidMount() {
    this.loadMore(true);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.handleScroll.cancel();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentTabId !== prevProps.currentTabId) {
      this.loadMore(true);
    }
  }

  setRootRef = el => (this.rootRef = el);

  handleChangeTab = tab => this.props.changeProfileActivityTab(tab.id);

  handleScroll = throttle(() => {
    const { isFetching } = this.props;

    if (!isFetching) {
      const rect = this.rootRef.getBoundingClientRect();
      if (rect.top + rect.height < window.innerHeight * 1.5) {
        this.loadMore();
      }
    }
  }, 1000);

  loadMore = (force = false) => {
    const { notifications } = this.props;

    let fromId = null;
    if (!force) {
      const lastNotification = notifications && notifications.get(-1);
      fromId = (lastNotification && lastNotification.get('_id')) || null;
    }

    if (force || !this.lastNotificationId || this.lastNotificationId !== fromId) {
      this.props.getNotificationsHistory({
        types: NOTIFICATIONS_FILTER_TYPES[this.props.currentTabId],
        fromId,
        limit: NOTIFICATIONS_PER_PAGE,
      });
    }

    this.lastNotificationId = fromId;
  };

  renderTabs = () => {
    const { isFetching, notifications, accounts } = this.props;
    const tabs = [
      {
        id: 'all',
        title: tt('activity.tab_title.all'),
        emptyListPlaceholder: tt('activity.tab_title.all_placeholder'),
      },
      {
        id: 'awards',
        title: tt('activity.tab_title.rewards'),
        emptyListPlaceholder: tt('activity.tab_title.rewards_placeholder'),
      },
      {
        id: 'answers',
        title: tt('activity.tab_title.replies'),
        emptyListPlaceholder: tt('activity.tab_title.replies_placeholder'),
      },
      {
        id: 'social',
        title: tt('activity.tab_title.social'),
        emptyListPlaceholder: tt('activity.tab_title.social_placeholder'),
      },
      {
        id: 'mentions',
        title: tt('activity.tab_title.mention'),
        emptyListPlaceholder: tt('activity.tab_title.mention_placeholder'),
      },
    ];

    return tabs.map(({ id, title, emptyListPlaceholder }, key) => (
      <TabContainer id={id} title={title} key={key}>
        <ActivityList
          isFetching={isFetching}
          notifications={notifications}
          accounts={accounts}
          emptyListPlaceholder={emptyListPlaceholder}
        />
      </TabContainer>
    ));
  };

  render() {
    const { isFetching, currentTabId, pageAccountName } = this.props;

    return (
      <Fragment>
        <Helmet title={tt('meta.title.profile.activity', { name: pageAccountName })} />
        <Header>{tt('g.activity')}</Header>
        <Card auto ref={this.setRootRef}>
          <Tabs activeTab={{ id: currentTabId }} onChange={this.handleChangeTab}>
            <CardContent column auto>
              {this.renderTabs()}
            </CardContent>
          </Tabs>
        </Card>
        <WrapperLoader>{isFetching && <LoadingIndicator type="circle" center />}</WrapperLoader>
      </Fragment>
    );
  }
}
