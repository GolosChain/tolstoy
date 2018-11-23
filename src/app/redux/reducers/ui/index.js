import { combineReducers } from 'redux';
import common from './common';
import home from './home';
import profile from './profile';
import votersDialog from 'src/app/redux/reducers/ui/votersDialog';
import wallet from './wallet';

export default combineReducers({
    common,
    home,
    profile,
    votersDialog,
    wallet,
});
