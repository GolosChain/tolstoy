import { createDeepEqualSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector } from 'src/app/redux/selectors/post/commonPost';

export const commentsContainerSelector = createDeepEqualSelector([currentPostSelector], post => {
    return {
        commentsCount: post.children,
    };
});
