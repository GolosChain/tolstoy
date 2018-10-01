import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import { List, Map } from 'immutable';

import { NOTIFICATIONS_FILTER_TYPES } from 'src/app/redux/constants/common';
import { notificationsMenuSelector } from 'src/app/redux/selectors/header/activity';
import { getNotificationsHistory } from 'src/app/redux/actions/notifications';

import { DialogFooter, DialogButton } from 'golos-ui/Dialog';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import ActivityList from 'src/app/components/common/ActivityList';

const NOTIFICATIONS_PER_PAGE = 5;

const Wrapper = styled.div`
    max-width: 370px;
`;

const WrapperActivity = styled.div`
    padding: 15px;
`;

const WrapperLoader = styled.div`
    display: flex;
    justify-content: center;
    height: 80px;
    min-width: 80px;
`;

const DialogButtonLink = DialogButton.withComponent(Link);

@connect(
    notificationsMenuSelector,
    {
        getNotificationsHistory,
    }
)
export default class NotificationsMenu extends PureComponent {
    static propTypes = {
        params: PropTypes.shape({
            accountName: PropTypes.string
        }),
        isFetching: PropTypes.bool,
        notifications: PropTypes.instanceOf(List),
        accounts: PropTypes.instanceOf(Map),
    };

    componentDidMount() {
        this.props.getNotificationsHistory({
            types: NOTIFICATIONS_FILTER_TYPES['all'],
            fromId: null,
            limit: NOTIFICATIONS_PER_PAGE,
        });
    }

    render() {
        const { isFetching, notifications, accounts, params: { accountName } } = this.props;

        return (
            <Wrapper>
                <WrapperActivity>
                    <ActivityList
                        isFetching={isFetching}
                        notifications={notifications}
                        accounts={accounts}
                        isCompact={true}
                    />
                    {isFetching && (
                        <WrapperLoader>
                            <LoadingIndicator type="circle" center />
                        </WrapperLoader>
                    )}
                </WrapperActivity>
                {!isFetching && (
                    <DialogFooter>
                        <DialogButtonLink primary to={`/@${accountName}/activity`}>Показать еще</DialogButtonLink>
                    </DialogFooter> 
                )}
            </Wrapper>
        );
    }
}
