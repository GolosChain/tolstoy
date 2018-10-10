import React, { PureComponent } from 'react';

import CurrencyValue from 'src/app/components/common/CurrencyValue';

export default class PostPayout extends PureComponent {
    render() {
        const { data, limitedOverallTotal, isLimit, isDeclined, className } = this.props;

        let style = null;

        if (isLimit || isDeclined) {
            style = {};

            if (isLimit) {
                style.opacity = 0.33;
            }

            if (isDeclined) {
                style.textDecoration = 'line-through';
            }
        }

        return (
            <CurrencyValue
                className={className}
                style={style}
                value={limitedOverallTotal}
                currency="GOLOS"
                date={data.get('last_payout')}
            />
        );
    }
}
