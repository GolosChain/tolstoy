import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import extractContent from 'app/utils/ExtractContent';
import { immutableAccessor } from 'app/utils/Accessors';

import { CommentCard } from './CommentCard';
import { currentUsernameSelector, globalSelector } from 'src/app/redux/selectors/common';
import { onVote } from 'src/app/redux/actions/vote';

export default connect(
    createSelector(
        [currentUsernameSelector, globalSelector('content'), (state, props) => props.permLink],
        (username, content, permLink) => {
            const comment = content.get(permLink);
            if (!comment) {
                return {
                    dataLoaded: false,
                    title: '',
                    fullParentURL: '',
                    isOwner: true,
                };
            }
            const extractedContent = extractContent(immutableAccessor, comment);
            const isOwner = username === comment.get('author');
            const payout =
                parseFloat(comment.get('pending_payout_value')) +
                parseFloat(comment.get('total_payout_value'));

            let fullParentURL = extractedContent.link;
            let title = extractedContent.title;

            if (comment.get('parent_author')) {
                title = comment.get('root_title');
                fullParentURL = `/${comment.get('category')}/@${comment.get(
                    'parent_author'
                )}/${comment.get('parent_permlink')}`;
            }

            return {
                comment,
                title,
                fullParentURL,
                extractedContent,
                isOwner,
                username,
                payout,
                dataLoaded: true,
            };
        }
    ),
    dispatch => ({
        onVote: (username, author, permLink, percent) => {
            dispatch(onVote(username, author, permLink, percent));
        },
        onNotify: text => {
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                    message: text,
                    dismissAfter: 5000,
                },
            });
        },
    }),
    null,
    { withRef: true }
)(CommentCard);
