import { connect } from 'react-redux';

import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { togglePinAction } from 'src/app/redux/actions/pinnedPosts';
import { openRepostDialog } from 'src/app/redux/actions/dialogs';
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
        let isRepost = false;

        if (props.additionalData) {
            if (props.additionalData.get('isRepost')) {
                isRepost = true;

                const body = props.additionalData.get('body');

                if (body) {
                    repostHtml = sanitizeRepostData(body);
                }
            }
        }

        return {
            myAccount: myAccountName,
            data,
            postLink: data.get('author') + '/' + data.get('permlink'),
            sanitizedData: sanitizeCardPostData(data),
            isRepost,
            repostHtml,
            isFavorite: state.data.favorites.set
                ? state.data.favorites.set.includes(props.permLink)
                : false,
            pinDisabled: props.pageAccountName !== myAccountName,
            isPinned,
            isOwner: myAccountName === data.get('author'),
        };
    },
    {
        toggleFavorite: (link, isAdd) => toggleFavoriteAction({ link, isAdd }),
        togglePin: (link, isPin) => togglePinAction(link, isPin),
        openRepostDialog: postLink => openRepostDialog(postLink),
    }
)(PostCard);
