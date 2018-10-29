import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { saveListScrollPosition } from 'src/app/redux/actions/ui';
import { CommentsList } from 'src/app/components/post/CommentsList/CommentsList';
import { commentsArrayToObject } from 'src/app/helpers/comments';

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
    const commentsAllData = commentsArrayToObject([...commentsFromStore.toJS()]);
    const result = [];

    for (let key in commentsAllData) {
        const currentComment = commentsAllData[key];

        if (isNotMainComment(currentComment, postPermLink)) {
            continue;
        }

        result.push(getCommentsWithRepliesRecursively(commentsAllData, currentComment));
    }

    sortComments(result, sortBy, commentsAllData);

    return result;
}

function isNotMainComment(currentComment, postPermLink) {
    return postPermLink !== currentComment.parent_permlink;
}

function getCommentsWithRepliesRecursively(commentsAllData, currentComment) {
    return {
        url: `${currentComment.author}/${currentComment.permlink}`,
        replies: getReplies(currentComment, commentsAllData),
    };
}

function getReplies(currentComment, commentsAllData) {
    const replies = currentComment.replies;
    let structuredReplies = [];

    for (let reply of replies) {
        const currentReply = commentsAllData[reply];

        let processedReplay = getCommentsWithRepliesRecursively(commentsAllData, currentReply);

        structuredReplies.push(processedReplay);
    }

    return structuredReplies;
}

function sortComments(comments, sortBy, commentsAllData) {
    sortMainComments(comments, sortBy, commentsAllData);
}

function sortMainComments(comments, sortBy, commentsAllData) {
    for (let commentBlock in comments) {
        let currentComment = commentBlock[0];
    }
}
