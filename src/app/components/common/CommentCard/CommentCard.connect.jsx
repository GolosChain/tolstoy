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
            const htmlContent = { __html: extractedContent.desc };
            const author = data.get('author');
            const parentAuthor = data.get('parent_author');
            const category = data.get('category');
            const parentPermLink = data.get('parent_permlink');
            const isOwner = username === author;

            let fullParentURL = extractedContent.link;
            let title = extractedContent.title;

            if (parentAuthor) {
                title = data.get('root_title');
                fullParentURL = `/${category}/@${parentAuthor}/${parentPermLink}`;
            }

            return {
                data,
                title,
                fullParentURL,
                htmlContent,
                contentLink: extractedContent.link,
                isOwner,
                username,
                parentAuthor,
                category,
                parentPermLink,
                author,
                created: data.get('created'),
                permLink: data.get('permlink'),
                commentsCount: data.get('children'),
                activeVotes: data.get('active_votes'),
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
