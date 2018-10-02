import { createDeepEqualSelector } from 'src/app/redux/selectors/common';
import {currentPostSelector, postSelector} from 'src/app/redux/selectors/post/commonPost';

export const commentsContainerSelector = createDeepEqualSelector([currentPostSelector, postSelector], (post, data) => {
    return {
        commentsCount: post.children,
        permLink: post.permlink,
        data
    };
});
