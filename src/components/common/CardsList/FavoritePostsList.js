import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { favoritesLoadNextPageAction } from 'app/redux/actions/favorites';
import { dataSelector, uiSelector } from 'app/redux/selectors/common';
import CardsList from './CardsList.connect';

export default connect(
  createSelector(
    [dataSelector('favorites'), uiSelector('profile')],
    (favorites, profileUI) => {
      const { isLoading, isPageLoading, showList } = favorites;

      const layout = (profileUI && profileUI.get('layout')) || 'list';

      return {
        isFavorite: true,
        layout,
        isLoading: isLoading || isPageLoading,
        items: showList,
      };
    }
  ),
  {
    loadMore: favoritesLoadNextPageAction,
  }
)(CardsList);
