import { Map } from 'immutable';

import { TAGS_FILTER_TYPES } from 'src/app/redux/constants/common';
import { dataSelector } from 'src/app/redux/selectors/common';
import { setSettingsOptions } from './settings';

const emptyMap = Map();

export function saveTag(tag, action) {
    return (dispatch, getState) => {
        const settings = dataSelector('settings')(getState());

        const selectedTags = settings.getIn(['basic', 'selectedTags'], emptyMap);

        const basic = {};
        const value = selectedTags.get(tag);

        if (action === 'filter') {
            if (!value || value === TAGS_FILTER_TYPES.SELECT) {
                basic.selectedTags = selectedTags.set(tag, TAGS_FILTER_TYPES.EXCLUDE);
            } else {
                basic.selectedTags = selectedTags.delete(tag);
            }
        } else if (action === 'select') {
            if (!value || value === TAGS_FILTER_TYPES.EXCLUDE) {
                basic.selectedTags = selectedTags.set(tag, TAGS_FILTER_TYPES.SELECT);
            } else {
                basic.selectedTags = selectedTags.delete(tag);
            }
        }

        dispatch(setSettingsOptions({ basic }));
    };
}

export function clearTags() {
    return setSettingsOptions({
        basic: {
            selectedTags: emptyMap,
        },
    });
}
