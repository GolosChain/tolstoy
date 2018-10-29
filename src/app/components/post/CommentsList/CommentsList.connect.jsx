import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { saveListScrollPosition } from 'src/app/redux/actions/ui';
import { CommentsList } from 'src/app/components/post/CommentsList/CommentsList';
import { commentsArrayToObject, getSortFunction } from 'src/app/helpers/comments';

//'votes', 'new', 'trending'
const sortedBy = (state, props) => 'votes';

export default connect(
    createSelector([commentsSelector, sortedBy], (commentsData, sortedBy) => {
        const { comments, postPermLink, isFetching } = commentsData;
        const structuredComments = buildCommentsStructure(comments, postPermLink, sortedBy);

        return {
            structuredComments,
            isFetching,
        };
    }),
    {
        saveListScrollPosition,
    }
)(CommentsList);

function buildCommentsStructure(commentsFromStore, postPermLink, sortBy) {
    const commentsFullData = commentsArrayToObject([...commentsFromStore.toJS()]);

    const result = [];
    for (let key in commentsFullData) {
        const currentComment = commentsFullData[key];

        if (isNotMainComment(currentComment, postPermLink)) {
            continue;
        }

        result.push(getCommentsWithRepliesRecursively(currentComment, commentsFullData));
    }

    sortComments(result, sortBy, commentsFullData);
    return result;
}

function isNotMainComment(currentComment, postPermLink) {
    return postPermLink !== currentComment.parent_permlink;
}

function getCommentsWithRepliesRecursively(currentComment, commentsFullData) {
    return {
        url: `${currentComment.author}/${currentComment.permlink}`,
        replies: getReplies(currentComment, commentsFullData),
    };
}

function getReplies(currentComment, commentsFullData) {
    const replies = currentComment.replies;
    let structuredReplies = [];

    for (let reply of replies) {
        const currentReply = commentsFullData[reply];

        let processedReplay = getCommentsWithRepliesRecursively(currentReply, commentsFullData);

        structuredReplies.push(processedReplay);
    }

    return structuredReplies;
}

function sortComments(comments, sortBy, commentsFullData) {
    comments.sort(getSortFunction(sortBy, commentsFullData));
    for (let comment of comments) {
        sortComments(comment.replies, sortBy, commentsFullData);
    }
}
