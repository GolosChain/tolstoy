import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentPostSelector } from 'src/app/redux/selectors/post/commonPost';
import { uiSelector, offchainSelector } from 'src/app/redux/selectors/common';

import { PostContent } from 'src/app/containers/post/postContent/PostContent';

export default connect(
    createSelector(
        [
            currentPostSelector,
            uiSelector('location'),
            offchainSelector(['config', 'relapio_token']),
        ],
        (post, location, relapioToken) => {
            const prev = location.get('previous');
            let backUrl = null;

            if (prev) {
                backUrl = prev.get('pathname') + prev.get('search') + prev.get('hash');
            }

            return {
                tags: post.tags,
                payout: post.payout,
                data: post.data,
                category: post.category,
                title: post.title,
                body: post.body,
                jsonMetadata: post.jsonMetadata,
                pictures: post.pictures,
                created: post.created,
                permLink: post.permLink,
                isPromoted: post.promotedAmount > 0,
                backUrl,
                relapioToken,
            };
        }
    )
)(PostContent);
