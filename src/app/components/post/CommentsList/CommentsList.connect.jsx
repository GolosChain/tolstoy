import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { commentsSelector } from 'src/app/redux/selectors/post/commonPost';
import { saveListScrollPosition } from 'src/app/redux/actions/ui';
import { CommentsList } from 'src/app/components/post/CommentsList/CommentsList';

const NESTED_COMMENTS_LEVELS_NUMBER = 6;

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
function findReplies(comments, currentComment, innerDeep = 0) {
    const commentWithReplies = [];
    const authorAndPermLink = `${currentComment.author}/${currentComment.permlink}`;

    commentWithReplies.push({
        authorAndPermLink,
        innerDeep,
    });

    const replies = currentComment.replies;

    if (replies.length) {
        if (innerDeep < NESTED_COMMENTS_LEVELS_NUMBER) {
            ++innerDeep;
        }
        for (let reply of replies) {
            const comment = getComment(comments, reply);
            const nestedReplies = findReplies(comments, comment, innerDeep);
            commentWithReplies.push(...nestedReplies);
        }
    }

    return commentWithReplies;
}

// function receive comments from store and parent post permlink, return array of arrays with comments
function mapComments(commentsFromStore, postPermLink, sortBy) {
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
    return sortingComments(comments, sortBy);
}
//'votes', 'new', 'trending'
const sortedBy = (state, props) => 'votes';

export default connect(
    createSelector([commentsSelector, sortedBy], (commentsData, sortedBy) => {
        const { comments, postPermLink, isFetching } = commentsData;
        const structuredComments = mapComments(comments, postPermLink, sortedBy);

        return {
            structuredComments,
            isFetching,
        };
    }),
    {
        saveListScrollPosition,
    }
)(CommentsList);


function sortingComments(comments, sortBy) {
    const sortedComments = [];
    comments = sortMainComments(comments, sortBy);
    return sortedComments;
}

function sortMainComments(comments, sortBy) {
    return comments.sort();
}
