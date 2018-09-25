import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { currentPostSelector, authorSelector } from 'src/app/redux/selectors/post/commanPost';

export const postHeaderSelector = createDeepEqualSelector(
    [currentPostSelector, authorSelector, currentUsernameSelector],
    (post, author, username) => ({
        username,
        isMy: username === author.account,
        created: post.created,
        isFavorite: post.isFavorite,
        author: author.account,
        isFollow: author.isFollow,
        permLink: post.permLink,
    })
);
