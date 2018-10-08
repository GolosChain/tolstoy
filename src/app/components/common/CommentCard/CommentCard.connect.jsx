import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import tt from 'counterpart';

import extractContent from 'app/utils/ExtractContent';
import { immutableAccessor } from 'app/utils/Accessors';

import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import { CommentCard } from './CommentCard';
import {currentUsernameSelector, globalSelector} from 'src/app/redux/selectors/common';

export default connect(
    createSelector(
        [globalSelector('content'), currentUsernameSelector, (state, props) => props],
        (content, username, props) => {

        const data = content.get(props.permLink);
        const extractedContent = extractContent(immutableAccessor, data);
        const htmlContent = { __html: extractedContent.desc };
        const isOwner = username === props.pageAccountName.toLowerCase();
        const parentAuthor = data.get('parent_author');
        const category = data.get('category');
        const parentPermLink = data.get('parent_permlink');

        let parentLink = extractedContent.link;
        let title = extractedContent.title;

        if (parentAuthor) {
            title = data.get('root_title');
            parentLink = `/${category}/@${parentAuthor}/${parentPermLink}`;
        }

        return {
            data,
            title,
            parentLink,
            htmlContent,
            content: extractedContent,
            isOwner,
            username,
            parentAuthor,
            category,
            parentPermLink,
            author: data.get('author'),
            created: data.get('created'),
            permLink: data.get('permlink'),
            commentsCount: data.get('children'),
            activeVotes: data.get('active_votes'),
        };
    }),
    dispatch => ({
        onVote: (percent, { username, author, permlink }) => {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'vote',
                    operation: {
                        voter: username,
                        author,
                        permlink,
                        weight: percent * 10000,
                        __config: {
                            title: percent < 0 ? tt('voting_jsx.confirm_flag') : null,
                        },
                    },
                    successCallback: () => dispatch(user.actions.getAccount()),
                })
            );
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
