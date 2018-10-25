import { Map } from 'immutable';
import { dataSelector } from 'src/app/redux/selectors/common';
import { setSettingsOptions } from './settings';

const emptyMap = Map();

export function saveTag(tag, action) {
    return (dispatch, getState) => {
        const settings = dataSelector('settings')(getState());

        const selectedTags = settings
            .getIn(['basic', 'selectedTags'], emptyMap);

        const basic = {};
        const value = selectedTags.get(tag);

        if (action === 'filter') {
            if (!value || value === 1) {
                basic.selectedTags = selectedTags.set(tag, 2);
            } else {
                basic.selectedTags = selectedTags.delete(tag);
            }
        } else if (action === 'select') {
            if (!value || value === 2) {
                basic.selectedTags = selectedTags.set(tag, 1);
            } else {
                basic.selectedTags = selectedTags.delete(tag);
            }
        }

        dispatch(setSettingsOptions({ basic }));
    };
}
