import React from 'react';
import PropTypes from 'prop-types';

import { CURRENCIES } from 'app/client_config';
import { renderValue } from 'src/app/helpers/currency';

export default function CurrencyValue({ value, currency, className, ...props }) {
    return <span className={className}>{renderValue(value, currency, props)}</span>;
}

CurrencyValue.propTypes = {
    value: PropTypes.number.isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    className: PropTypes.string,
    decimals: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['short', 'adaptive'])]),
    date: PropTypes.string,
    toCurrency: PropTypes.oneOf(CURRENCIES),
    rates: PropTypes.object,
    settings: PropTypes.object,
};
