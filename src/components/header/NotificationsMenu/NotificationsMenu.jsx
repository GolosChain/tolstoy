import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'mocks/react-router';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import { List, Map } from 'immutable';
import tt from 'counterpart';

import globalBus from 'src/helpers/globalBus';
import { FormFooter, FormFooterButton } from 'golos-ui/Form';
import LoadingIndicator from 'src/components/elements/LoadingIndicator';
import ActivityList from 'src/components/common/ActivityList';

const NOTIFICATIONS_PER_PAGE = 20;
const LOAD_MORE_VERTICAL_GAP = 300;

const Wrapper = styled.div`
  width: 370px;

  ${is('mobile')`
        width: auto;
        box-shadow: inset 0 0 18px 4px rgba(0, 0, 0, 0.05);
    `};
`;

const WrapperActivity = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`;

const WrapperLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  min-width: 80px;
`;

const StyledDialogFooter = styled(FormFooter)`
  margin: 0;
`;

const ButtonShowAll = FormFooterButton.withComponent(Link);

export default class NotificationsMenu extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      accountName: PropTypes.string,
    }),
    accounts: PropTypes.instanceOf(Map),

    // connect
    notifications: PropTypes.instanceOf(List),
    authorizedUsername: PropTypes.string,
    isFetching: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    getNotificationsOnlineHistory: PropTypes.func,
    markAllNotificationsAsViewed: PropTypes.func,
  };

  root = createRef();
  listWrapper = createRef();

  componentDidMount() {
    this.props.getNotificationsOnlineHistory({
      fromId: null,
      limit: NOTIFICATIONS_PER_PAGE,
    });

    window.addEventListener('click', this.checkClickLink);
  }

  componentWillUnmount() {
    this.onScrollLazy.cancel();
    window.removeEventListener('click', this.checkClickLink);
    this.props.clearOnlineNotifications();
  }

  checkClickLink = e => {
    const a = e.target.closest('a');

    if (this.root.current.contains(a)) {
      this.props.onClose();
    }
  };

  markNotificationsAsViewed = () => {
    this.props.markAllNotificationsAsViewed({
      user: this.props.authorizedUsername,
    });
  };

  checkLoadMore() {
    const { canLoadMore, isFetching, lastLoadedId } = this.props;

    if (!canLoadMore || isFetching || !lastLoadedId) {
      return;
    }

    const list = this.listWrapper.current;

    // Если до конца скролла осталось меньше чем LOAD_MORE_VERTICAL_GAP
    if (list.scrollHeight - list.clientHeight - list.scrollTop < LOAD_MORE_VERTICAL_GAP) {
      const { lastLoadedId } = this.props;

      this.props.getNotificationsOnlineHistory({
        fromId: lastLoadedId,
        limit: NOTIFICATIONS_PER_PAGE,
      });
    }
  }

  onScroll = () => {
    this.checkLoadMore();
    globalBus.emit('notifications:checkVisibility');
  };

  onScrollLazy = throttle(this.onScroll, 200, { leading: false });

  render() {
    const {
      isFetching,
      notifications,
      accounts,
      isMobile,
      canLoadMore,
      params: { accountName },
    } = this.props;

    const clearTooltip = `<div style="text-align: center">${tt(
      'notifications_menu.clear_notifications_history'
    )}</div>`;

    return (
      <Wrapper mobile={isMobile} ref={this.root}>
        <WrapperActivity
          ref={this.listWrapper}
          onScroll={this.onScrollLazy}
          className="js-scroll-container"
        >
          {notifications.size ? (
            <ActivityList
              isFetching={isFetching}
              notifications={notifications}
              accounts={accounts}
              isCompact
              checkVisibility
              emptyListPlaceholder={tt('g.empty')}
            />
          ) : null}
          {isFetching || canLoadMore ? (
            <WrapperLoader>
              <LoadingIndicator type="circle" />
            </WrapperLoader>
          ) : null}
        </WrapperActivity>
        <StyledDialogFooter>
          <FormFooterButton
            data-tooltip={clearTooltip}
            data-tooltip-html
            aria-label={tt('notifications_menu.clear_notifications_history')}
            cancel={1}
            onClick={this.markNotificationsAsViewed}
          >
            {tt('dialog.clear')}
          </FormFooterButton>
          <ButtonShowAll
            to={`/@${accountName}/activity`}
            aria-label={tt('dialog.show_all')}
            primary={1}
          >
            {tt('dialog.show_all')}
          </ButtonShowAll>
        </StyledDialogFooter>
      </Wrapper>
    );
  }
}
