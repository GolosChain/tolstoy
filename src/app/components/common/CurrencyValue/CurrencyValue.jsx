import React from 'react';
import { connect } from 'react-redux';
import { dataSelector } from 'src/app/redux/selectors/common';
import { renderValue } from 'src/app/helpers/currency';

function CurrencyValue({ value, currency, toCurrency, date, rates, className, style }) {
    return (
        <span className={className} style={style}>
            {renderValue(value, currency, {
                toCurrency,
                date,
                rates,
            })}
        </span>
    );
}

export default connect(state => ({
    rates: dataSelector('rates')(state),
}))(CurrencyValue);
