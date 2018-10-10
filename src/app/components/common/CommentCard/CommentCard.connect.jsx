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
            const data = content.get(props.permLink);
            const extractedContent = extractContent(immutableAccessor, data);
            const isOwner = username === data.get('author');

            let fullParentURL = extractedContent.link;
            let title = extractedContent.title;

            if (data.get('parent_author')) {
                title = data.get('root_title');
                fullParentURL = `/${data.get('category')}/@${data.get('parent_author')}/${data.get('parent_permlink')}`;
            }

            return {
                data,
                title,
                fullParentURL,
                extractedContent,
                isOwner,
                username,
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
