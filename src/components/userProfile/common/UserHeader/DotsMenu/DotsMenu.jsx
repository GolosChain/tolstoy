import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

const fromUp = keyframes`
    from {
        bottom: calc(100% + 15px);
        opacity: 0;
    }
    to {
        bottom: calc(100% + 5px);
        opacity: 1;
    }
`;

const Wrapper = styled.div`
  position: absolute;
  right: 50%;
  z-index: 1000;
  transform: translateX(50%);
  padding: 5px 0;
  margin-bottom: 5px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  animation: ${fromUp} 0.2s linear forwards;
`;

const Pointer = styled.div`
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translate(50%, -50%) rotate(45deg);
  width: 14px;
  height: 14px;
  background: #ffffff;
  box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.05);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  background-color: #ffffff;

  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  font-weight: normal;
  color: #333333;
`;

const MuteButton = styled.button`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  cursor: pointer;
  white-space: nowrap;
  text-transform: capitalize;
  outline: none;

  &:hover {
    background: #f5f5f5;
  }

  & ${Icon} {
    flex-shrink: 0;
    margin-right: 5px;
  }
`;

export default class DotsMenu extends PureComponent {
  static propTypes = {
    authUser: PropTypes.string,
    profileButtonsInfo: PropTypes.object,
    accountUsername: PropTypes.string.isRequired,
    updateFollow: PropTypes.func.isRequired,
  };

  wrapperRef = createRef();

  componentDidMount() {
    setTimeout(() => {
      window.addEventListener('click', this.onAwayClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onAwayClick);
  }

  onAwayClick = e => {
    if (!this.wrapperRef.current.contains(e.target)) {
      this.props.closeMenu();
    }
  };

  handleUpdateFollow(type) {
    const { authUser, accountUsername } = this.props;

    this.props.updateFollow(authUser, accountUsername, type);
  }

  muteUser = () => {
    this.handleUpdateFollow('ignore');
    this.props.closeMenu();
  };

  unmuteUser = () => {
    this.handleUpdateFollow(null);
    this.props.closeMenu();
  };

  render() {
    const { profileButtonsInfo } = this.props;

    return (
      <Wrapper ref={this.wrapperRef}>
        <Pointer />
        <Content>
          {profileButtonsInfo.followState !== 'ignore' ? (
            <MuteButton onClick={this.muteUser}>
              <Icon name="mute" size="18" />
              {tt('g.mute')}
            </MuteButton>
          ) : (
            <MuteButton onClick={this.unmuteUser}>
              <Icon name="unmute" size="18" />
              {tt('g.unmute')}
            </MuteButton>
          )}
        </Content>
      </Wrapper>
    );
  }
}
