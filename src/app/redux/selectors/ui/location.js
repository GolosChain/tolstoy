import { createSelector } from 'reselect';

export const locationSelector = createSelector([state => state.ui.location], location =>
    location.get('current')
);

export const pathnameSelector = createSelector([locationSelector], location =>
    location.get('pathname')
);

export const locationQuerySelector = createSelector([locationSelector], location =>
    location.get('query')
);
