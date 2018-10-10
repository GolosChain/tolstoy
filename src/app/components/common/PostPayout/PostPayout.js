import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { renderValue } from 'src/app/helpers/currency';
import { getPayout } from 'src/app/redux/selectors/payout/common';

@connect(getPayout)
export default class PostPayout extends PureComponent {
    render() {
        const { data, limitedOverallTotal, isLimit, isDeclined, className } = this.props;

        const amount = renderValue(limitedOverallTotal, 'GOLOS', null, data.get('last_payout'));

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
                {amount}
            </span>
        );
    }
}
