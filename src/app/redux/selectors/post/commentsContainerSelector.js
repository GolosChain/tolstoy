import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector, postSelector } from 'src/app/redux/selectors/post/commonPost';

export default createDeepEqualSelector(
    [currentPostSelector, postSelector, currentUsernameSelector],
    (post, data, username) => {
        return {
            commentsCount: post.children,
            commentAuthor: post.author,
            commentPermLink: post.permLink,
            username: username,
            permLink: post.permlink,
            data,
        };
    }
);
