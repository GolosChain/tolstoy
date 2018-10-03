import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { commentsSelector } from 'src/app/redux/selectors/post/commonPost';

export default createDeepEqualSelector(
    [currentUsernameSelector, commentsSelector],
    (username, comments) => {
        return {
            username,
            ...comments,
        };
    }
);
