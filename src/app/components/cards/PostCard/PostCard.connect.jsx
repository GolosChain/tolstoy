import { connect } from 'react-redux';
import tt from 'counterpart';

import user from 'app/redux/User';
import transaction from 'app/redux/Transaction';
import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { togglePinAction } from 'src/app/redux/actions/pinnedPosts';
import { getPinnedPosts } from 'src/app/redux/selectors/account/pinnedPosts';
import { sanitizeCardPostData, sanitizeRepostData } from 'src/app/redux/selectors/post/commonPost';
import PostCard from './PostCard';

export default connect(
    (state, props) => {
        const myAccountName = state.user.getIn(['current', 'username']);

        let isPinned = false;

        if (props.showPinButton) {
            isPinned = getPinnedPosts(state, props.pageAccountName).includes(props.permLink);
        }

        const data = state.global.getIn(['content', props.permLink]);

        let repostHtml = null;

        if (props.isRepost) {
            const body = props.repostData.get('body');

            if (body) {
                repostHtml = sanitizeRepostData(body);
            }
        }

        return {
            myAccount: myAccountName,
            data,
            sanitizedData: sanitizeCardPostData(data),
            repostHtml,
            isFavorite: state.data.favorites.set
                ? state.data.favorites.set.includes(props.permLink)
                : false,
            pinDisabled: props.pageAccountName !== myAccountName,
            isPinned,
            isOwner: myAccountName === data.get('author'),
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
