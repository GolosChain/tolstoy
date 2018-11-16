import { combineReducers } from 'redux';
import common from './common';
import location from './location';
import home from './home';
import profile from './profile';
import votersDialog from 'src/app/redux/reducers/ui/votersDialog';
import wallet from './wallet';

export default combineReducers({
    common,
    location,
    home,
    profile,
    votersDialog,
    wallet,
});
