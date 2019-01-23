import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import CurationPercent from './CurationPercent';

const selector = createSelector(
    [state => state.global.get('content'), (state, props) => props.postLink],
    (content, postLink) => {
        const post = content.get(postLink);

        let curationPercent = null;

        if (post) {
            curationPercent = Math.round(post.get('curation_rewards_percent') / 100);
        }

        return {
            curationPercent,
        };
    }
);

export default connect(selector)(CurationPercent);
