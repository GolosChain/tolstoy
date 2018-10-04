import { createDeepEqualSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { commentsSelector, postSelector } from 'src/app/redux/selectors/post/commonPost';

export default createDeepEqualSelector(
    [postSelector, currentUsernameSelector, commentsSelector],
    (data, username, comments) => {
        return {
            data,
            username,
            ...comments,
        };
    }
);
