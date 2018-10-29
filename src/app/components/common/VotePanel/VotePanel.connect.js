import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { postSelector } from 'src/app/redux/selectors/post/commonPost';
import { onVote } from 'src/app/redux/actions/vote';
import { calcVotesStats } from 'app/utils/StateFunctions';
import VotePanel from './VotePanel';

export default connect(
    createSelector(
        [currentUsernameSelector, (state, props) => postSelector(state, props.contentLink)],
        (username, post) => {
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
                votesSummary,
                myVote,
            };
        }
    ),
    {
        onVote,
    }
)(VotePanel);
