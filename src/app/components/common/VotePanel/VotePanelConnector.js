import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUserSelector, currentUsernameSelector } from 'src/app/redux/selectors/common';
import { postSelector } from 'src/app/redux/selectors/post/commonPost';
import { onVote } from 'src/app/redux/actions/vote';
import { calcVotesStats } from 'app/utils/StateFunctions';
import { openVotersDialog } from 'src/app/redux/actions/dialogs';
import { loginIfNeed } from 'src/app/redux/actions/login';
import { VOTE_PERCENT_THRESHOLD } from './helpers';

const defaultVotePowerSelector = state => state.data.settings.getIn(['basic', 'award']);

export default connect(
    createSelector(
        [
            currentUserSelector,
            currentUsernameSelector,
            (state, props) => postSelector(state, props.contentLink),
            defaultVotePowerSelector,
        ],
        (user, username, post, defaultVotePower) => {
            if (!post) {
                return;
            }

            const votes = post.get('active_votes');
            let isRich = false;

            if (user) {
                const netVesting =
                    user.get('vesting_shares') -
                    user.get('delegated_vesting_shares') +
                    user.get('received_vesting_shares');

                isRich = netVesting > VOTE_PERCENT_THRESHOLD;
            }

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
                isRich,
                data: post,
                contentLink: `${post.get('author')}/${post.get('permlink')}`,
                votesSummary,
                myVote,
                defaultVotePower,
            };
        }
    ),
    {
        onVote,
        openVotersDialog,
        loginIfNeed,
    }
);
