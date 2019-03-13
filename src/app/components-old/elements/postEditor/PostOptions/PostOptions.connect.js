import { connect } from 'react-redux';

import PostOptions from './PostOptions';

export default connect(state => {
    const chainProps = state.global.get('chain_properties');

    if (!chainProps) {
        return {};
    }

    return {
        minCurationPercent: chainProps.get('min_curation_percent'),
        maxCurationPercent: chainProps.get('max_curation_percent'),
    };
})(PostOptions);
