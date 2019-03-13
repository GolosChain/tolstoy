import { connect } from 'react-redux';

//import { markNotificationAsRead } from 'src/app/redux/actions/notificationsOnline';
import ActivityItem from './ActivityItem';

export default connect(
  null,
  {
    markNotificationAsRead: () => {},
  }
)(ActivityItem);
