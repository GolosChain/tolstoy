import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Badge = styled.div`
  position: absolute;
  top: -7px;
  left: 9px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2px 4px;

  border-radius: 40px;
  min-width: 20px;
  min-height: 20px;
  border: 2px solid #fff;
  background-color: #fc5d16;

  color: #fff;
  font-size: 10px;
  font-weight: bold;
  line-height: 12px;
  text-align: center;
`;

export default class IconBadge extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    size: PropTypes.number,
    count: PropTypes.number,
  };

  render() {
    const { count, ...props } = this.props;
    const gtThousand = count > 999;

    return (
      <Wrapper>
        <Icon {...props} />
        {Boolean(count) && <Badge>{gtThousand ? '999+' : count}</Badge>}
      </Wrapper>
    );
  }
}
