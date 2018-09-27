import { createDeepEqualSelector } from 'src/app/redux/selectors/common';
import { authorSelector, currentPostSelector } from 'src/app/redux/selectors/post/commonPost';

export const aboutPanelSelector = createDeepEqualSelector(
    [authorSelector, currentPostSelector],
    (author, post) => {
        return {
            name: author.name,
            account: author.account,
            about: author.about,
            created: author.created,
            url: post.url,
        };
    }
);
