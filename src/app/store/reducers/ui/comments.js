import { SET_COMMENTS_FILTER } from 'store/constants/actionTypes';
import { SORT_BY_NEWEST } from 'shared/constants';

const initialState = {
  filterSortBy: SORT_BY_NEWEST,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SET_COMMENTS_FILTER:
      return {
        filterSortBy: payload.filter,
      };

    default:
      return state;
  }
}
