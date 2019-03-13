import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedRelative } from 'react-intl';

const CHECK_ONLINE_EVERY = 2 * 60 * 1000;

const Root = styled.div`
  display: flex;
  height: 26px;
  padding: 0 12px;
  border-radius: 100px;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  color: #fff;
  background: rgba(0, 0, 0, 0.31);
  user-select: none;
  cursor: default;
`;

export default class OnlineStatus extends PureComponent {
  static propTypes = {
    username: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    className: PropTypes.string,
    fetchUserLastOnline: PropTypes.func,
  };

  state = {
    lastOnlineTs: null,
  };

  componentDidMount() {
    const { isOwner } = this.props;

    if (!isOwner) {
      this.fetch();

      this.intervalId = setInterval(this.fetch, CHECK_ONLINE_EVERY);
    }
  }

  componentWillUnmount() {
    this.unmount = true;

    clearInterval(this.intervalId);
  }

  fetch = () => {
    const { username } = this.props;

    this.props.fetchUserLastOnline(username, lastOnlineTs => {
      if (!this.unmount) {
        this.setState({
          lastOnlineTs,
        });
      }
    });
  };

  render() {
    const { isOwner, className } = this.props;
    const { lastOnlineTs } = this.state;

    if (!lastOnlineTs || isOwner) {
      return null;
    }

    const lastOnlineDate = new Date(lastOnlineTs);

    if (Date.now() - lastOnlineDate.getTime() < 5 * 60 * 1000) {
      return <Root className={className}>Online</Root>;
    }

    return (
      <Root className={className}>
        <FormattedRelative value={lastOnlineDate} />
      </Root>
    );
  }
}
