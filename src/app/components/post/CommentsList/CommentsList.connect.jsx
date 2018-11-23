import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { saveListScrollPosition } from 'src/app/redux/actions/ui';
import { CommentsList } from 'src/app/components/post/CommentsList/CommentsList';
import { commentsArrayToObject, getSortFunction } from 'src/app/helpers/comments';
import { locationSelector } from 'src/app/redux/selectors/ui/location';

function buildCommentsStructure(commentsFromStore, postPermLink, sortBy = 'old') {
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

export default connect(
    createSelector([commentsSelector, locationSelector], (commentsData, location) => {
        const { comments, postPermLink, isFetching } = commentsData;
        const structuredComments = buildCommentsStructure(
            comments,
            postPermLink,
            location.query.sort
        );

        return {
            structuredComments,
            isFetching,
        };
    }),
    {
        saveListScrollPosition,
    }
)(CommentsList);
