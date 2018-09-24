import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import {
    currentPostSelector,
    authorSelector,
    votesSummarySelector,
    postSelector,
} from 'src/app/redux/selectors/post/commanPost';

export const activePanelSelector = createDeepEqualSelector(
    [
        currentPostSelector,
        authorSelector,
        currentUsernameSelector,
        votesSummarySelector,
        postSelector,
    ],
    (post, author, username, votesSummary, data) => {
        return {
            votesSummary,
            data,
            username,
            permLink: post.permLink,
            account: author.account,
            isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
        };
    }
);
