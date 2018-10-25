import { createDeepEqualSelector, globalSelector } from 'src/app/redux/selectors/common';

const getVotersUI = state => state.ui.votersDialog;

export const votersDialogSelector = createDeepEqualSelector(
    [
        getVotersUI,
        globalSelector('content'),
        (state, props) => props.postLink,
        (state, props) => props.isLikes,
    ],
    (votersDialog, content, postLink, isLikes) => {
        let voters = content.getIn([postLink, 'active_voters'], []);
        console.log(isLikes);
        return {
            loading: votersDialog.loading,
            users: voters.filter(
                voter => (voter.percent > 0 && isLikes) || (voter.percent < 0 && !isLikes)
            ),
        };
    }
);
