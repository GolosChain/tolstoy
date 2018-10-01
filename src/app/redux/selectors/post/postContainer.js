import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { authorSelector, currentPostSelector } from 'src/app/redux/selectors/post/commonPost';

export const postContainerSelector = createDeepEqualSelector(
    [currentPostSelector, authorSelector, currentUsernameSelector],
    (post, author, username) => {
        return {
            account: author.account,
            postLoaded: !!post,
            isUserAuth: !!username,
        };
    }
);
