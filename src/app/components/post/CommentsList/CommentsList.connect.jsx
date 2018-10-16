import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { saveListScrollPosition } from 'src/app/redux/actions/ui';
import { CommentsList } from 'src/app/components/post/CommentsList/CommentsList';

const INSET_COMMENTS_LEVELS_NUMBER = 6;

// function receive original comments array, and reply on current cycle, searching this one in original array,
// make it null for remove redundant cycles
// return current reply object
function getComment(comments, reply) {
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];
        if (comment === null) {
            continue;
        }
        if (`${comment.author}/${comment.permlink}` === reply) {
            comments[i] = null;
            return comment;
        }
    }
}

// recursive function receive original comments array, comment object on current cycle, third param is deep of reply
// return array with current comment object and replies (on this comment) objects
function findReplies(comments, currentComment, insetDeep = 0) {
    const commentWithReplies = [];
    const authorAndPermLink = `${currentComment.author}/${currentComment.permlink}`;

    commentWithReplies.push({
        authorAndPermLink,
        insetDeep,
    });

    const replies = currentComment.replies;

    if (replies.length) {
        if (insetDeep < INSET_COMMENTS_LEVELS_NUMBER) {
            ++insetDeep;
        }
        replies.forEach(reply => {
            const comment = getComment(comments, reply);
            const insetReplies = findReplies(comments, comment, insetDeep);
            commentWithReplies.push(...insetReplies);
        });
    }

    return commentWithReplies;
}

// function receive comments from store and parent post permlink, return array of arrays with comments
function mapComments(commentsFromStore, postPermLink) {
    const comments = [];
    const commentsCopy = [...commentsFromStore.toJS()];
    for (let i = 0; i < commentsCopy.length; i++) {
        const currentComment = commentsCopy[i];

        if (!currentComment || postPermLink !== currentComment.parent_permlink) {
            continue;
        }

        commentsCopy[i] = null;

        comments.push(findReplies(commentsCopy, currentComment));
    }
    return comments;
}

export default connect(
    createSelector([commentsSelector], commentsData => {
        const { comments, postPermLink, isFetching } = commentsData;
        const structuredComments = mapComments(comments, postPermLink);

        return {
            structuredComments,
            isFetching,
        };
    }),
    {
        saveListScrollPosition,
    }
)(CommentsList);
