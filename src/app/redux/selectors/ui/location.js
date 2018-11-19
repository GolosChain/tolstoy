import { createSelector } from 'reselect';

export const locationSelector = createSelector([state => state.ui.location], location =>
    location.get('current').toJS()
);

export const pathnameSelector = createSelector([locationSelector], location => location.pathname);
