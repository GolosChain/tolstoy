import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List } from 'immutable';
import tt from 'counterpart';

import LoadingIndicator from 'src/app/components-old/elements/LoadingIndicator';

import Avatar from 'src/app/components/common/Avatar';
import Follow from 'src/app/components/common/Follow';
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
} from 'src/app/components/dialogs/common/Dialog';

const ShowAll = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;

  color: #111111;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: #2879ff;
  }
`;

const EmptyBlockLikeFollow = styled.div`
  min-width: 165px;

  @media (max-width: 500px) {
    min-width: 34px;
    max-width: 34px;
  }
`;

const Percent = styled.p`
  margin: 0;
  padding: 0;
  min-width: 37px;
  width: 37px;
  max-width: 37px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.29;
  letter-spacing: 0.4px;
  color: #393636;
  text-align: center;
`;

export default class VotersDialog extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    users: PropTypes.instanceOf(List),
    username: PropTypes.string.isRequired,
  };

  componentDidMount() {
    if (this.props.users.size === 0) {
      this.props.getVoters(this.props.postLink, 50);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && nextProps.users.size === 0 && nextProps.hasMore) {
      this.props.getVoters(this.props.postLink);
    }
  }

  showAll = () => {
    this.props.getVoters(this.props.postLink);
  };

  render() {
    const { loading, users, hasMore, username, isLikes } = this.props;
    return (
      <Dialog>
        <Header>
          <Title>{tt(`dialog.${isLikes ? 'liked' : 'disliked'}`)}</Title>
          <IconClose onClick={this.props.onClose} />
        </Header>
        <Content>
          {users.map(user => (
            <UserItem key={user.name}>
              <UserLink to={`/@${user.name}`} title={user.name} onClick={this.props.onClose}>
                <Avatar avatarUrl={user.avatar} />
                <Name>{user.name}</Name>
              </UserLink>
              <Percent>{Math.round(user.percent)}%</Percent>
              {user.name !== username ? (
                <Follow following={user.name} collapseOnMobile />
              ) : (
                <EmptyBlockLikeFollow />
              )}
            </UserItem>
          ))}
          {loading && (
            <LoaderWrapper>
              <LoadingIndicator type="circle" size={40} />
            </LoaderWrapper>
          )}
        </Content>
        {hasMore && !loading ? (
          <ShowAll onClick={this.showAll}>{tt('dialog.show_all')}</ShowAll>
        ) : null}
      </Dialog>
    );
  }
}
