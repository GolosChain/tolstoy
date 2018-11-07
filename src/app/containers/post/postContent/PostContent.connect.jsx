import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentPostSelector } from 'src/app/redux/selectors/post/commonPost';
import {
    offchainSelector,
    routeParamSelector,
    currentUsernameSelector,
} from 'src/app/redux/selectors/common';

import { PostContent } from 'src/app/containers/post/postContent/PostContent';

export default connect(
    createSelector(
        [
            currentPostSelector,
            currentUsernameSelector,
            routeParamSelector('action'),
            offchainSelector(['config', 'relapio_token']),
        ],
        (post, username, action, relapioToken) => {
            return {
                isAuthor: username === post.author,
                author: post.author,
                payout: post.payout,
                data: post.data,
                title: post.title,
                body: post.body,
                pictures: post.pictures,
                created: post.created,
                permLink: post.permLink,
                isPromoted: post.promotedAmount > 0,
                url: post.url,
                action,
                relapioToken,
            };
        }
    )
)(PostContent);
