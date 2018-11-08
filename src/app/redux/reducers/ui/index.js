import { combineReducers } from 'redux';
import common from './common';
import location from './location';
import home from './home';
import profile from './profile';
import votersDialog from 'src/app/redux/reducers/ui/votersDialog';
import commentInput from './commentInput';

export default combineReducers({
    common,
    location,
    home,
    profile,
    votersDialog,
    commentInput,
});
