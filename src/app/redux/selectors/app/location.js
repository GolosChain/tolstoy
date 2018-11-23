import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const locationSelector = createSelector([state => state.app.get('location')], location =>
    location.get('current')
);

export const pathnameSelector = createSelector([locationSelector], location =>
    location.get('pathname')
);

export const locationSearchSelector = createSelector(
    [locationSelector],
    location => (location && location.get('search')) || ''
);

export const locationQuerySelector = createSelector(
    [locationSelector],
    location => (location && location.get('query')) || Map()
);

export const locationTagsSelector = createSelector([locationQuerySelector], query => {
    const tags = query.getIn(['tags'], '').split('|');

    const tagsSelect = tags[0] ? tags[0].split(',').sort() : [];
    const tagsFilter = tags[1] ? tags[1].split(',').sort() : [];

    let tagsStr = tagsSelect.join(',');
    if (tagsFilter.length) {
        tagsStr += `|${tagsFilter.join(',')}`;
    }

    return {
        tagsSelect,
        tagsFilter,
        tagsStr,
    };
});
