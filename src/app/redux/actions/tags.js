import { push } from 'react-router-redux';

import { locationTagsSelector } from 'src/app/redux/selectors/app/location';

export function saveTag(tag, action) {
    return (dispatch, getState) => {
        const tags = locationTagsSelector(getState());

        const { tagsSelect, tagsFilter } = tags;

        const tagsSelectIndex = tagsSelect.indexOf(tag);
        const tagsFilterIndex = tagsFilter.indexOf(tag);

        if (action === 'filter') {
            if (tagsFilterIndex !== -1) {
                tagsFilter.splice(tagsFilterIndex, 1);
            } else {
                tagsFilter.push(tag);

                // remove from select tags if exists
                if (tagsSelectIndex !== -1) {
                    tagsSelect(tagsSelectIndex);
                }
            }
        } else if (action === 'select') {
            if (tagsSelectIndex !== -1) {
                tagsSelect.splice(tagsSelectIndex, 1);
            } else {
                tagsSelect.push(tag);

                // remove from filter tags if exists
                if (tagsFilterIndex !== -1) {
                    tagsSelect.splice(tagsFilterIndex, 1);
                }
            }
        }

        let tagsStr = tagsSelect.join(',');
        if (tagsFilter.length) {
            tagsStr += `|${tagsFilter.join(',')}`;
        }

        dispatch(
            push({
                pathname: window.location.pathname,
                query: tagsStr.length ? { tags: tagsStr } : {},
            })
        );
    };
}

export function deleteTag(tag) {
    return (dispatch, getState) => {
        const { tagsSelect, tagsFilter } = locationTagsSelector(getState());

        const tagsSelectIndex = tagsSelect.indexOf(tag);
        const tagsFilterIndex = tagsFilter.indexOf(tag);

        if (tagsSelectIndex !== -1) {
            tagsSelect.splice(tagsSelectIndex, 1);
        }

        if (tagsFilterIndex !== -1) {
            tagsFilter.splice(tagsFilterIndex, 1);
        }

        let tagsStr = tagsSelect.join(',');
        if (tagsFilter.length) {
            tagsStr += `|${tagsFilter.join(',')}`;
        }

        dispatch(
            push({
                pathname: window.location.pathname,
                query: tagsStr.length ? { tags: tagsStr } : {},
            })
        );
    };
}
