import {
    createDeepEqualSelector,
    globalSelector,
    currentUsernameSelector,
} from 'src/app/redux/selectors/common';
import { Set } from 'immutable';

const getVotersUI = state => state.ui.votersDialog;

export const votersDialogSelector = createDeepEqualSelector(
    [
        getVotersUI,
        globalSelector('content'),
        globalSelector('accounts'),
        (state, props) => props.postLink,
        (state, props) => props.isLikes,
        currentUsernameSelector,
    ],
    (votersDialog, content, accounts, postLink, isLikes, username) => {
        const post = content.get(postLink, Set());
        let voters = post.get('active_voters', []);

        return {
            loading: votersDialog.get('loading'),
            users: voters
                .filter(voter => (voter.percent > 0 && isLikes) || (voter.percent < 0 && !isLikes))
                .map(voter => ({
                    name: voter.voter,
                    avatar: (
                        JSON.parse(accounts.getIn([voter.voter, 'json_metadata'])).profile || {}
                    ).profile_image,
                })),
            hasMore: voters.length < post.get('active_votes_count'),
            username,
        };
    }
);
