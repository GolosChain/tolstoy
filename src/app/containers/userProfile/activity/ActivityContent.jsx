import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';
import tt from 'counterpart';
import { Helmet } from 'react-helmet';
import throttle from 'lodash/throttle';

import { NOTIFICATIONS_FILTER_TYPES, NOTIFICATIONS_PER_PAGE } from 'src/app/redux/constants/common';

import Card from 'golos-ui/Card';
import { TabContainer, Tabs } from 'golos-ui/Tabs';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import ActivityList from 'src/app/components/common/ActivityList';
import Flex from 'golos-ui/Flex';

const WrapperLoader = styled.div`
    display: flex;
    justify-content: center;
    height: 80px;
    padding-top: 20px;
`;

const CardContent = styled(Flex)``;

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
            { id: 'all', title: tt('activity.tab_title.all') },
            { id: 'awards', title: tt('activity.tab_title.rewards') },
            { id: 'answers', title: tt('activity.tab_title.replies') },
            { id: 'social', title: tt('activity.tab_title.social') },
            { id: 'mentions', title: tt('activity.tab_title.mention') },
        ];

        return tabs.map(({ id, title }, key) => (
            <TabContainer id={id} title={title} key={key}>
                <ActivityList
                    isFetching={isFetching}
                    notifications={notifications}
                    accounts={accounts}
                />
            </TabContainer>
        ));
    };

    render() {
        const { isFetching, currentTabId, pageAccountName } = this.props;

        return (
            <Fragment>
                <Helmet title={tt('meta.title.profile.activity', { name: pageAccountName })} />
                <Card auto innerRef={this.setRootRef}>
                    <Tabs activeTab={{ id: currentTabId }} onChange={this.handleChangeTab}>
                        <CardContent column auto>
                            {this.renderTabs()}
                        </CardContent>
                    </Tabs>
                </Card>
                <WrapperLoader>
                    {isFetching && <LoadingIndicator type="circle" center />}
                </WrapperLoader>
            </Fragment>
        );
    }
}
