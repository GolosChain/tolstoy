import React from 'react';
import { renderValue } from 'src/app/helpers/currency';

export default function CurrencyValue({
    value,
    currency,
    toCurrency,
    date,
    rates,
    className,
    style,
}) {
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
