import { connect } from 'react-redux';

import { hydratedNotificationOnlineSelector } from 'app/redux/selectors/notifications';

import NotificationOnlineContent from './NotificationOnlineContent';

export default connect(hydratedNotificationOnlineSelector)(NotificationOnlineContent);
