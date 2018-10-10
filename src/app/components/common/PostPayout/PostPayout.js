import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getPayout } from 'src/app/redux/selectors/payout/common';
import CurrencyValue from 'src/app/components/common/CurrencyValue';

@connect(getPayout)
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
            <span className={className} style={style}>
                <CurrencyValue
                    value={limitedOverallTotal}
                    currency="GOLOS"
                    date={data.get('last_payout')}
                />
            </span>
        );
    }
}
