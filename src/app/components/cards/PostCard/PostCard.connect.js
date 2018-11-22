import { connect } from 'react-redux';

import {
    createDeepEqualSelector,
    dataSelector,
    globalSelector,
    currentUsernameSelector,
} from 'src/app/redux/selectors/common';
import { toggleFavorite } from 'src/app/redux/actions/favorites';
import { togglePin } from 'src/app/redux/actions/pinnedPosts';
import { openRepostDialog } from 'src/app/redux/actions/dialogs';
import { getPinnedPosts } from 'src/app/redux/selectors/account/pinnedPosts';
import { sanitizeCardPostData, sanitizeRepostData } from 'src/app/redux/selectors/post/commonPost';
import PostCard from './PostCard';

import { hasReblog, extractReblogData } from 'app/utils/StateFunctions';

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
            let reblogData = null;

            if (hasReblog(data)) {
                isRepost = true;
                reblogData = extractReblogData(data);

                const body = reblogData.get('body');

                if (body) {
                    repostHtml = sanitizeRepostData(body);
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
                stats: data.get('stats').toJS(),
                reblogData,
            };
        }
    ),
    {
        toggleFavorite,
        togglePin,
        openRepostDialog,
    }
)(PostCard);
