import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import { List, Map } from 'immutable';
import tt from 'counterpart';

import { NOTIFICATIONS_FILTER_TYPES } from 'src/app/redux/constants/common';
import { notificationsMenuSelector } from 'src/app/redux/selectors/header/activity';

import { DialogFooter, DialogButton } from 'golos-ui/Dialog';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import ActivityList from 'src/app/components/common/ActivityList';

const NOTIFICATIONS_PER_PAGE = 5;

const Wrapper = styled.div`
    width: 370px;
`;

const WrapperActivity = styled.div`
    padding: 15px;
`;

const WrapperLoader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    min-width: 80px;
`;

const StyledDialogFooter = styled(DialogFooter)`
    margin: 0;
`;

const DialogButtonLink = DialogButton.withComponent(Link);

@connect(notificationsMenuSelector)
export default class NotificationsMenu extends PureComponent {
    static propTypes = {
        params: PropTypes.shape({
            accountName: PropTypes.string,
        }),
        isFetching: PropTypes.bool,
        notifications: PropTypes.instanceOf(List),
        accounts: PropTypes.instanceOf(Map),

        onClose: PropTypes.func.isRequired,
        getNotificationsHistory: PropTypes.func.isRequired,
        notifyMarkAllAsViewed: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.getNotificationsHistory({
            types: NOTIFICATIONS_FILTER_TYPES['all'],
            fromId: null,
            limit: NOTIFICATIONS_PER_PAGE,
        });
        this.props.notifyMarkAllAsViewed();

        window.addEventListener('click', this.checkClickLink);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.checkClickLink);
    }

    checkClickLink = e => {
        const a = e.target.closest('a');

        if (a) {
            this.props.onClose();
        }
    };

    render() {
        const {
            isFetching,
            notifications,
            accounts,
            params: { accountName },
        } = this.props;

        return (
            <Wrapper>
                <WrapperActivity>
                    {isFetching ? (
                        <WrapperLoader>
                            <LoadingIndicator type="circle" />
                        </WrapperLoader>
                    ) : (
                        <ActivityList
                            isFetching={isFetching}
                            notifications={notifications}
                            accounts={accounts}
                            isCompact={true}
                        />
                    )}
                </WrapperActivity>
                <StyledDialogFooter>
                    <DialogButtonLink primary={1} to={`/@${accountName}/activity`}>
                        {tt('g.show_more')}
                    </DialogButtonLink>
                </StyledDialogFooter>
            </Wrapper>
        );
    }
}
