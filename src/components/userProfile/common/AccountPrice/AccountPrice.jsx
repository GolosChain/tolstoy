import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
//import { getAccountPrice } from 'src/app/redux/selectors/account/accountPrice';
import { formatCurrency } from 'src/helpers/currency';

const FONT_MULTIPLIER = 48;

const Body = styled.div`
  height: 103px;
  padding: 0 14px;
  border-bottom: 1px solid #e9e9e9;
  line-height: 102px;
  text-align: center;
  font-size: ${props => props.fontSize}px;
  font-weight: bold;
  white-space: nowrap;
  color: #3684ff;
  overflow: hidden;
  text-overflow: ellipsis;
`;

@connect((state, props) => {
  // const { price, currency } = getAccountPrice(state, props.accountName);

  return {
    price: '1.123',
    currency: 'GLS',
  };
})
export default class AccountPrice extends PureComponent {
  static propTypes = {
    accountName: PropTypes.string.isRequired,
  };

  render() {
    const { price, currency } = this.props;

    const sumString = formatCurrency(price, currency, 'adaptive');

    return <Body fontSize={Math.floor(FONT_MULTIPLIER * (8 / sumString.length))}>{sumString}</Body>;
  }
}
