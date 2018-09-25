import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getPayout } from 'src/app/helpers/currency';

class PostPayout extends PureComponent {
    render() {
        const { data, className } = this.props;

        return getPayout(data, className);
    }
}

export default connect(state => ({
    rates: state.data.rates,
}))(PostPayout);
