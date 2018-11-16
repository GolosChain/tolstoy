import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import extractContent from 'app/utils/ExtractContent';

import { CommentCard } from './CommentCard';
import {
    currentUsernameSelector,
    appSelector,
    globalSelector,
} from 'src/app/redux/selectors/common';
import { onVote } from 'src/app/redux/actions/vote';
import { showNotification } from 'src/app/redux/actions/ui';

export default connect(
    createSelector(
        [
            appSelector('location'),
            currentUsernameSelector,
            globalSelector('content'),
            (_, props) => props.permLink,
        ],
        (location, username, content, permLink) => {
            const comment = content.get(permLink);
            if (!comment) {
                return {
                    dataLoaded: false,
                    title: '',
                    isOwner: true,
                };
            }
            const extractedContent = extractContent(comment);
            const isOwner = username === comment.get('author');
            const payout =
                parseFloat(comment.get('pending_payout_value')) +
                parseFloat(comment.get('total_payout_value'));

            let title = extractedContent.title;
            if (comment.get('parent_author')) {
                title = comment.get('root_title');
            }

            let fullParentUrl = `/@${comment.get('parent_author')}/${comment.get(
                'parent_permlink'
            )}`;
            if (comment.has('category')) {
                fullParentUrl = `/${comment.get('category')}/@${comment.get(
                    'parent_author'
                )}/${comment.get('parent_permlink')}`;
            }

            return {
                comment,
                location,
                fullParentUrl,
                stats: comment.get('stats').toJS(),
                title,
                extractedContent,
                isOwner,
                username,
                payout,
                anchorId: `@${permLink}`,
                dataLoaded: true,
            };
        }
    ),
    {
        onVote,
        onNotify: showNotification,
    },
    null,
    { withRef: true }
)(CommentCard);
