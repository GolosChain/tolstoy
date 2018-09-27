import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commonPost';
import { followingSelector } from 'src/app/redux/selectors/follow/follow';

export const postHeaderSelector = createDeepEqualSelector(
    [
        currentPostSelector,
        authorSelector,
        currentUsernameSelector,
        followingSelector('blog_result'),
    ],
    (post, author, username, follow) => ({
        username,
        isMy: username === author.account,
        created: post.created,
        isFavorite: post.isFavorite,
        author: author.account,
        isFollow: follow.includes(author.account),
        permLink: post.permLink,
    })
);
