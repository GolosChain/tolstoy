import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon/index';

import DotsMenu from 'src/components/userProfile/common/UserHeader/DotsMenu/DotsMenu';

const Wrapper = styled.div`
  position: relative;
  grid-area: dots;
  align-self: center;
  margin: 0 0 -5px 5px;

  @media (max-width: 576px) {
    margin: 0 0 0 5px;
  }
`;

const Dots = styled.button`
  display: flex;
  padding: 5px;
  cursor: pointer;
  color: #ffffff;
  outline: none;

  &:hover {
    color: #2879ff;
  }

  @media (max-width: 576px) {
    color: #333333;
  }
`;

export default class DotsButton extends Component {
  static propTypes = {
    authUser: PropTypes.string,
    profileButtonsInfo: PropTypes.object,
    accountUsername: PropTypes.string.isRequired,
    updateFollow: PropTypes.func.isRequired,
  };

  state = {
    menuOpen: false,
  };

  toggleMenu = () => {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };

  render() {
    const { authUser, accountUsername, updateFollow, profileButtonsInfo } = this.props;
    const { menuOpen } = this.state;

    return (
      <Wrapper>
        {menuOpen && (
          <DotsMenu
            authUser={authUser}
            accountUsername={accountUsername}
            updateFollow={updateFollow}
            profileButtonsInfo={profileButtonsInfo}
            closeMenu={this.closeMenu}
          />
        )}
        <Dots onClick={this.toggleMenu}>
          <Icon name="dots" width="3" height="15" />
        </Dots>
      </Wrapper>
    );
  }
}
