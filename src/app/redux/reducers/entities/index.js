import { combineEntitiesReducers } from 'src/app/helpers/reduxEntities';

import notifications from './notifications';
import notificationsOnline from './notificationsOnline';

export default combineEntitiesReducers({
    notifications,
    notificationsOnline,
});
