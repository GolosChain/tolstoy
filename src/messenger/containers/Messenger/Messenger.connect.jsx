import { connect } from 'react-redux';

import MessengerApp from './Messenger';

import { initMessenger } from 'src/messenger/redux/actions/messenger';

export default connect(
    null,
    {
        initMessenger,
    }
)(MessengerApp);
