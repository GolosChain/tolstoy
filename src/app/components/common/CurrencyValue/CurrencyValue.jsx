import React from 'react';
import { connect } from 'react-redux';
import { dataSelector } from 'src/app/redux/selectors/common';
import { renderValueEx } from 'src/app/helpers/currency';

function CurrencyValue({ value, currency, toCurrency, date, rates }) {
    return renderValueEx(value, currency, {
        toCurrency,
        date,
        rates,
    });
}

export default connect(state => ({
    rates: dataSelector('rates')(state),
}))(CurrencyValue);
