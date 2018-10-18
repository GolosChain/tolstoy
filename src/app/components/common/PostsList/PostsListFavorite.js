import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import PostsList from './PostsList';
import { favoritesLoadNextPageAction } from 'src/app/redux/actions/favorites';
import { fetchCurrentStateAction } from 'src/app/redux/actions/fetch';
import { dataSelector, uiSelector } from 'src/app/redux/selectors/common';

export default connect(
    createSelector([dataSelector('favorites'), uiSelector('profile')], (favorites, profileUI) => {
        const { isLoading, isPageLoading, showList } = favorites;

        const layout = (profileUI && profileUI.get('layout')) || 'list';

        return {
            isFavorite: true,
            layout,
            isLoading: isLoading || isPageLoading,
            posts: showList,
        };
    }),
    dispatch => ({
        loadMore() {
            dispatch(favoritesLoadNextPageAction());
        },
        loadContent(permLink) {
            return new Promise((resolve, reject) => {
                const [author, permlink] = permLink.split('/');

                dispatch({
                    type: 'GET_CONTENT',
                    payload: {
                        author,
                        permlink,
                        resolve,
                        reject,
                    },
                });
            });
        },
        fetchState() {
            dispatch(fetchCurrentStateAction());
        },
    })
)(PostsList);
