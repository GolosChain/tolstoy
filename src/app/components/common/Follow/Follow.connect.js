import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { followSelector } from 'src/app/redux/selectors/follow/follow';
import { updateFollow } from 'src/app/redux/actions/follow';

import Follow from './Follow';
import { confirmUnfollowDialog } from 'src/app/redux/actions/dialogs';

export default connect(
    createSelector([currentUsernameSelector, followSelector], (username, { isFollow }) => ({
        username,
        isFollow,
    })),
    {
        updateFollow,
        // confirmUnfollowDialog wrapped because of recursive import problem,
        // while this file executes confirmUnfollowDialog is undefined
        confirmUnfollowDialog: (...args) => confirmUnfollowDialog(...args),
    }
)(Follow);
