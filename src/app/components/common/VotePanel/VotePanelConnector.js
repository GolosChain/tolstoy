import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { postSelector } from 'src/app/redux/selectors/post/commonPost';
import { onVote } from 'src/app/redux/actions/vote';
import { calcVotesStats } from 'app/utils/StateFunctions';
import { openVotersDialog } from 'src/app/redux/actions/dialogs';
import { loginIfNeed } from 'src/app/redux/actions/login';

export default connect(
    createSelector(
        [currentUsernameSelector, (state, props) => postSelector(state, props.contentLink)],
        (username, post) => {
            if (!post) {
                return;
            }

            const votes = post.get('active_votes');

            let myVote = null;

            for (let vote of votes) {
                if (vote.get('voter') === username) {
                    myVote = vote.toJS();
                    myVote.weight = parseInt(myVote.weight || 0, 10);
                    break;
                }
            }

            const votesSummaryIm = post.get('votesSummary');
            const votesSummary = votesSummaryIm
                ? votesSummaryIm.toJS()
                : calcVotesStats(votes.toJS(), username);

            return {
                username,
                data: post,
                contentLink: `${post.get('author')}/${post.get('permlink')}`,
                votesSummary,
                myVote,
            };
        }
    ),
    {
        onVote,
        openVotersDialog,
        loginIfNeed,
    }
);
