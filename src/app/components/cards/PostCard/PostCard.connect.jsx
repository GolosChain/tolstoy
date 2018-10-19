import { connect } from 'react-redux';
import tt from 'counterpart';

import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { togglePinAction } from 'src/app/redux/actions/pinnedPosts';
import { getPinnedPosts } from 'src/app/redux/selectors/account/pinnedPosts';
import PostCard from './PostCard';

export default connect(
    (state, props) => {
        const myAccountName = state.user.getIn(['current', 'username']);

        let isPinned = false;

        if (props.showPinButton) {
            isPinned = getPinnedPosts(state, props.pageAccountName).includes(props.permLink);
        }

        return {
            myAccount: myAccountName,
            data: state.global.getIn(['content', props.permLink]),
            isFavorite: state.data.favorites.set
                ? state.data.favorites.set.includes(props.permLink)
                : false,
            pinDisabled: props.pageAccountName !== myAccountName,
            isPinned,
        };
    },
    dispatch => ({
        onVote: (percent, { myAccount, author, permlink }) => {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'vote',
                    operation: {
                        voter: myAccount,
                        author,
                        permlink,
                        weight: Math.round(percent * 10000),
                        __config: {
                            title: percent < 0 ? tt('voting_jsx.confirm_flag') : null,
                        },
                    },
                    successCallback: () => dispatch(user.actions.getAccount()),
                })
            );
        },
        toggleFavorite: (link, isAdd) => {
            dispatch(toggleFavoriteAction({ link, isAdd }));
        },
        togglePin: (link, isPin) => {
            dispatch(togglePinAction(link, isPin));
        },
    })
)(PostCard);
