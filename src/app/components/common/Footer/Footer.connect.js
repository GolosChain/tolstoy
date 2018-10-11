import { connect } from 'react-redux';

import { createDeepEqualSelector, dataSelector, globalSelector } from 'src/app/redux/selectors/common';

import Footer from './Footer';

export default connect(
    createDeepEqualSelector(
        [dataSelector('rates'), dataSelector('settings'), globalSelector('props')],
        (rates, settings, props) => {
            const pricePerGolos = rates.actual.GBG.GOLOS;
            // Delete GOLOS from string and get currentSupply in GBG
            const currentSupply = Math.floor(parseInt(props.get('current_supply')) / pricePerGolos);

            return {
                currentSupply,
                currency: settings.getIn(['basic', 'currency']), // for rerender if changed
            };
        }
    )
)(Footer);
