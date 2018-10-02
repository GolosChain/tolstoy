import { createSelector } from 'reselect';

export const locationSelector = createSelector([state => state.ui.location], location =>
    location.get('current').toJS()
);
