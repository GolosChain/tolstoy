import { createDeepEqualSelector } from 'src/app/redux/selectors/common';

export const commentsContainerSelector = createDeepEqualSelector([], () => {
    return {};
});
