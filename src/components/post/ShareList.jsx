import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import is from 'styled-is';
import tt from 'counterpart';
import { shareList } from 'helpers/socialShare';

import Icon from 'components/golos-ui/Icon';

const Wrapper = styled.div`
  ${is('horizontal')`
    display: flex;
  `};
`;

const ItemContainer = styled.div`
  display: flex;
  padding: 18px;
  cursor: pointer;

  &:hover {
    color: #2879ff;
  }
`;

export default class ShareList extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    horizontal: PropTypes.bool,
  };

  static defaultProps = {
    horizontal: false,
  };

  render() {
    const { horizontal, post } = this.props;

    return (
      <Wrapper horizontal={horizontal}>
        {shareList.map(item => (
          <ItemContainer
            key={item.icon}
            aria-label={tt(item.ariaLabel)}
            onClick={e => {
              e.preventDefault();
              item.callback(post);
            }}
          >
            <Icon name={item.icon} />
          </ItemContainer>
        ))}
      </Wrapper>
    );
  }
}
