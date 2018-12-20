import { connect } from 'react-redux';
import { Map } from 'immutable';

import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import { showNotification } from 'src/app/redux/actions/ui';

import UserProfile from './UserProfile';

export default connect(
    (state, props) => {
        const accountName = props.params.accountName.toLowerCase();

        const currentUser = state.user.get('current') || Map();
        const currentAccount = state.global.getIn(['accounts', accountName]);

        const fetching = state.app.get('loading');
        const isOwner = currentUser.get('username') === accountName;

        const followerCount = state.global.getIn(
            ['follow_count', accountName, 'follower_count'],
            0
        );

        const followingCount = state.global.getIn(
            ['follow_count', accountName, 'following_count'],
            0
        );

        return {
            pageAccountName: accountName,
            currentUser,
            currentAccount,

            fetching,
            isOwner,

            followerCount,
            followingCount,
        };
    },
    dispatch => ({
        uploadImage: (file, progress) => {
            dispatch({
                type: 'user/UPLOAD_IMAGE',
                payload: { file, progress },
            });
        },
        updateAccount: ({ successCallback, errorCallback, ...operation }) => {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'account_metadata',
                    operation,
                    successCallback() {
                        dispatch(user.actions.getAccount());
                        successCallback();
                    },
                    errorCallback,
                })
            );
        },
        notify: (message, dismiss = 3000) => {
            dispatch(showNotification(message, 'settings', dismiss));
        },
    })
)(UserProfile);
