import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import { FormattedDate } from 'react-intl';
import tt from 'counterpart';

import ActivityItem from './ActivityItem';

const DateWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
`;

const Date = styled.div`
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 13px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 300;
    color: #333;
    background: #fff;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
    cursor: default;
`;

export default class ActivityList extends Component {
    static propTypes = {
        isFetching: PropTypes.bool,
        notifications: PropTypes.instanceOf(List),
        accounts: PropTypes.instanceOf(Map),
        isCompact: PropTypes.bool,
    };

    renderDate(notification) {
        const { isCompact } = this.props;

        if (!isCompact && notification.get('isNextDay')) {
            return (
                <DateWrapper>
                    <Date>
                        <FormattedDate
                            value={notification.get('createdAt')}
                            day="numeric"
                            month="long"
                            year="numeric"
                        />
                    </Date>
                </DateWrapper>
            );
        }

        return null;
    }

    render() {
        const { isFetching, isCompact, notifications, accounts } = this.props;

        return (
            <Fragment>
                {notifications.map(notification => (
                    <Fragment key={notification.get('_id')}>
                        {this.renderDate(notification)}
                        <ActivityItem
                            notification={notification}
                            accounts={accounts}
                            isCompact={isCompact}
                        />
                    </Fragment>
                ))}
                {!isFetching && !notifications.size && <div>{tt('g.empty')}</div>}
            </Fragment>
        );
    }
}
