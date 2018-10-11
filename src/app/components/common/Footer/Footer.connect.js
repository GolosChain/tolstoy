import { connect } from 'react-redux';

import Footer from './Footer';

export default connect(state => ({
    pricePerGolos: state.data.rates.actual.GBG.GOLOS,
    curreny: state.data.settings.getIn(['basic', 'currency']), // for rerender if changed
}))(Footer);
