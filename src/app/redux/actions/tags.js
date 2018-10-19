import { dataSelector } from 'src/app/redux/selectors/common';
import { setSettingsOptions } from './settings';

export function saveTag(tag, action) {
    return (dispatch, getState) => {
        const settings = dataSelector('settings')(getState());

        const selectedFilterTags = settings.getIn(['basic', 'selectedFilterTags']);
        const selectedSelectTags = settings.getIn(['basic', 'selectedSelectTags']);

        const filterTagIndex = selectedFilterTags.indexOf(tag);
        const selectTagIndex = selectedSelectTags.indexOf(tag);

        const basic = {};

        if (action === 'filter') {
            if (filterTagIndex !== -1) {
                basic.selectedFilterTags = selectedFilterTags.remove(filterTagIndex);
            } else {
                basic.selectedFilterTags = selectedFilterTags.push(tag);

                // remove from select tags if exists
                if (selectTagIndex !== -1) {
                    basic.selectedSelectTags = selectedSelectTags.remove(selectTagIndex);
                }
            }
        } else if (action === 'select') {
            if (selectTagIndex !== -1) {
                basic.selectedSelectTags = selectedSelectTags.remove(selectTagIndex);
            } else {
                basic.selectedSelectTags = selectedSelectTags.push(tag);

                // remove from filter tags if exists
                if (filterTagIndex !== -1) {
                    basic.selectedFilterTags = selectedFilterTags.remove(filterTagIndex);
                }
            }
        }

        dispatch(setSettingsOptions({ basic }));
    };
}
