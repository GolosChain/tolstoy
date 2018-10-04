import { createSelector } from 'reselect';
import memorize from 'lodash/memoize';

export const extractPinnedPosts = memorize(jsonMetadata => {
    if (jsonMetadata) {
        try {
            const meta = JSON.parse(jsonMetadata);

            if (meta.pinnedPosts && Array.isArray(meta.pinnedPosts)) {
                return meta.pinnedPosts;
            }
        } catch (err) {
            console.error(err);
        }
    }

    return [];
});


export const getPinnedPosts = createSelector(
    (state, accountName) => state.global.getIn(['accounts', accountName, 'json_metadata']),
    extractPinnedPosts
);
