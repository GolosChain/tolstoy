import { connect } from 'react-redux';

import { createDeepEqualSelector, globalSelector } from 'src/app/redux/selectors/common';

import Footer from './Footer';

export default connect(
    createDeepEqualSelector([globalSelector('props')], globalProps => ({
        currentSupply: globalProps.get('current_supply'),
    }))
)(Footer);
