import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import is from 'styled-is';

import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';

const IconStyled = styled(Icon)`
  flex-shrink: 0;
  margin-right: 6px;
`;

const collapseStyles = `
    width: 34px;
    height: 34px;
    min-width: 0;
    border-radius: 50%;
    
    span {
        display: none;
    }
    
    & > svg {
        min-width: 12px;
        min-height: 12px;
        margin: 0;
    };
`;

const Wrapper = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 165px;
  font-size: 12px;
  font-weight: bold;
  line-height: 23px;

  span {
    margin-top: 1px;
  }

  ${is('collapse')`
    ${collapseStyles}
  `};

  ${is('collapseOnMobile')`
    @media (max-width: 500px) {
      ${collapseStyles}
    }
  `};
`;

export default class Follow extends Component {
  static propTypes = {
    // external
    following: PropTypes.string.isRequired,
    collapseOnMobile: PropTypes.bool,
    collapse: PropTypes.bool,
    onClick: PropTypes.func,

    // connect
    username: PropTypes.string,
    isFollow: PropTypes.bool,
  };

  static defaultProps = {
    collapseOnMobile: false,
    collapse: false,
    onClick: () => {},
  };

  follow = e => {
    const { username, following, updateFollow, onClick } = this.props;
    updateFollow(username, following, 'blog');
    onClick(e);
  };

  unfollow = e => {
    const { following, onClick, confirmUnfollowDialog } = this.props;
    confirmUnfollowDialog(following);
    onClick(e);
  };

  render() {
    const { collapseOnMobile, collapse, isFollow, className } = this.props;

    return isFollow ? (
      <Wrapper
        light
        collapseOnMobile={collapseOnMobile}
        collapse={collapse}
        onClick={this.unfollow}
        className={className}
      >
        <IconStyled width="14" height="10" name="tick" />
        <span>{tt('g.subscriptions')}</span>
      </Wrapper>
    ) : (
      <Wrapper
        collapseOnMobile={collapseOnMobile}
        collapse={collapse}
        onClick={this.follow}
        className={className}
      >
        <IconStyled width="14" height="14" name="plus" />
        <span>{tt('g.follow')}</span>
      </Wrapper>
    );
  }
}
