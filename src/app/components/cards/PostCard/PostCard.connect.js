import { connect } from 'react-redux';

import {
    createDeepEqualSelector,
    dataSelector,
    globalSelector,
    currentUsernameSelector,
} from 'src/app/redux/selectors/common';
import { toggleFavoriteAction } from 'src/app/redux/actions/favorites';
import { togglePinAction } from 'src/app/redux/actions/pinnedPosts';
import { openRepostDialog } from 'src/app/redux/actions/dialogs';
import { getPinnedPosts } from 'src/app/redux/selectors/account/pinnedPosts';
import { sanitizeCardPostData, sanitizeRepostData } from 'src/app/redux/selectors/post/commonPost';
import PostCard from './PostCard';

export default connect(
    createDeepEqualSelector(
        [
            currentUsernameSelector,
            dataSelector(['favorites', 'set']),
            dataSelector('settings'),
            (state, props) => globalSelector(['content', props.permLink])(state),
            (state, props) =>
                props.showPinButton &&
                getPinnedPosts(state, props.pageAccountName).includes(props.permLink),
            (_, props) => props,
        ],
        (currentUsername, favoritesSet, settings, data, isPinned, props) => {
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

            const isOwner = currentUsername === data.get('author');

            return {
                myAccount: currentUsername,
                isNsfw: data.getIn(['stats', 'isNsfw']),
                nsfwPref: settings.getIn(['basic', 'nsfw']),
                hideNsfw:
                    data.getIn(['stats', 'isNsfw']) &&
                    settings.getIn(['basic', 'nsfw']) === 'hide' &&
                    !isOwner,
                data,
                postLink: data.get('author') + '/' + data.get('permlink'),
                sanitizedData: sanitizeCardPostData(data),
                isRepost,
                repostHtml,
                isFavorite: favoritesSet ? favoritesSet.includes(props.permLink) : false,
                pinDisabled: props.pageAccountName !== currentUsername,
                isPinned,
                isOwner,
            };
        }
    ),
    {
        toggleFavorite: (link, isAdd) => toggleFavoriteAction({ link, isAdd }),
        togglePin: togglePinAction,
        openRepostDialog,
    }
)(PostCard);
