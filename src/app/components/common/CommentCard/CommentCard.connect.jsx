import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import extractContent from 'app/utils/ExtractContent';
import { immutableAccessor } from 'app/utils/Accessors';

import { CommentCard } from './CommentCard';
import { currentUsernameSelector, globalSelector } from 'src/app/redux/selectors/common';
import { onVote } from 'src/app/redux/actions/vote';

export default connect(
    createSelector(
        [globalSelector('content'), currentUsernameSelector, (state, props) => props],
        (content, username, props) => {
            const comment = content.get(props.permLink);
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
    })
)(CommentCard);
