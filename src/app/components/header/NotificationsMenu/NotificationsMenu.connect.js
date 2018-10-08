import { connect } from 'react-redux';

import { notificationsMenuSelector } from 'src/app/redux/selectors/header/activity';

import NotificationsMenu from './NotificationsMenu';

export default connect(notificationsMenuSelector)(NotificationsMenu)