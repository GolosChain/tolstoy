import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import styled from 'styled-components';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import Avatar from 'components/common/Avatar';
import Follow from 'components/common/Follow';
import {
  Dialog,
  Header,
  Title,
  IconClose,
  Content,
  UserItem,
  UserLink,
  Name,
  LoaderWrapper,
} from 'components/dialogs/common/Dialog';

const USERS_PER_PAGE = 20;

const ShowMore = styled.button`
  width: 100%;
  height: 50px;
  padding: 17px 0;

  border-radius: 0 0 8px 8px;
  box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  font-weight: bold;

  color: #111111;
  text-align: center;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #2879ff;
  }
`;

const StyledLoaderWrapper = styled(LoaderWrapper)`
  @media (max-width: 768px) {
    align-items: ${({ cutContent }) => (cutContent ? 'flex-start' : 'center')};
  }
`;

const MAX_FOLLOWERS_PER_REQUEST = 100; // from golos-js

export default class FollowersDialog extends PureComponent {
  static propTypes = {
    // external
    pageAccountName: PropTypes.string,
    type: PropTypes.string,

    // connect
    loading: PropTypes.bool,
    followCount: PropTypes.number,
    users: PropTypes.instanceOf(Set),
    getFollowers: PropTypes.func,
    getFollowing: PropTypes.func,
  };

  rootRef = null;
  lastUserName = '';

  componentDidMount() {
    this.loadMore();
  }

  setRootRef = el => (this.rootRef = el);

  showMore = () => {
    this.loadMore(MAX_FOLLOWERS_PER_REQUEST);
  };

  loadMore = (limit = USERS_PER_PAGE) => {
    const { pageAccountName, users, type } = this.props;

    const lastUser = users && users.last(null);
    const startUserName = (lastUser && lastUser.get('name')) || '';

    if (!this.lastUserName || this.lastUserName !== startUserName) {
      if (type === 'follower') {
        this.props.getFollowers({
          following: pageAccountName,
          startFollower: startUserName,
          limit,
        });
      } else {
        this.props.getFollowing({
          follower: pageAccountName,
          startFollowing: startUserName,
          limit,
        });
      }
    }

    this.lastUserName = startUserName;
  };

  renderUser = user => (
    <UserItem key={user.get('name')}>
      <UserLink to={`/@${user.get('name')}`} title={user.get('name')} onClick={this.props.onClose}>
        <Avatar avatarUrl={user.get('profileImage')} />
        <Name>{user.get('profileName')}</Name>
      </UserLink>
      <Follow following={user.get('name')} collapseOnMobile />
    </UserItem>
  );

  render() {
    const { loading, followCount, users, type } = this.props;
    const hasMore = followCount > users.size + 1;

    return (
      <Dialog>
        <Header>
          <Title>{tt(`user_profile.${type}_count`, { count: followCount })}</Title>
          <IconClose onClick={this.props.onClose} />
        </Header>
        <Content ref={this.setRootRef}>
          {users.map(this.renderUser)}
          {loading && (
            <StyledLoaderWrapper cutContent={hasMore}>
              <LoadingIndicator type="circle" size={40} />
            </StyledLoaderWrapper>
          )}
        </Content>
        {hasMore && !loading ? (
          <ShowMore onClick={this.showMore}>{tt('dialog.show_more')}</ShowMore>
        ) : null}
      </Dialog>
    );
  }
}
