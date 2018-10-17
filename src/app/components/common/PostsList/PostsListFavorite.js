import { connect } from 'react-redux';
import PostsList from './PostsList';
import { favoritesLoadNextPageAction } from 'src/app/redux/actions/favorites';

export default connect(
    state => {
        const { isLoading, isPageLoading, showList } = state.data.favorites;

        const layout = state.ui.profile && state.ui.profile.get('layout') || 'list';

        return {
            isFavorite: true,
            layout,
            isLoading: isLoading || isPageLoading,
            posts: showList,
        };
    },
    dispatch => ({
        loadMore() {
            dispatch(favoritesLoadNextPageAction());
        },
    })
)(PostsList);
