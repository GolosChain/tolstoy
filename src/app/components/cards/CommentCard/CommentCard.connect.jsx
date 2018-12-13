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
import { openTransferDialog } from 'src/app/redux/actions/dialogs';

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

            const fullParentUrl = comment.get('url').split('#')[0];

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
        openDonateDialog: (toAccount, url) =>
            openTransferDialog(toAccount, {
                type: 'donate',
                donatePostUrl: url,
            }),
    },
    null,
    { withRef: true }
)(CommentCard);
