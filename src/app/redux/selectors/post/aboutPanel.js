import { createDeepEqualSelector } from 'src/app/redux/selectors/common';
import { authorSelector } from 'src/app/redux/selectors/post/commonPost';

export const aboutPanelSelector = createDeepEqualSelector([authorSelector], author => ({
    name: author.name,
    account: author.account,
    about: author.about,
    created: author.created,
}));
