import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector } from 'src/app/redux/selectors/post/commonPost';

export default createDeepEqualSelector(
    [currentPostSelector, currentUsernameSelector],
    (post, username) => {
        return {
            postAuthor: post.author,
            postPermLink: post.permLink,
            username: username,
            postCommentsArr: post.postCommentsArr,
        };
    }
);
