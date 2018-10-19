import { connect } from 'react-redux';

import { repost } from 'src/app/redux/actions/repost';
import { showNotification } from 'src/app/redux/actions/ui';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import RepostDialog from './RepostDialog';

export default connect(
    (state, props) => ({
        myAccountName: currentUsernameSelector(state),
        post: state.global.getIn(['content', props.postLink]),
    }),
    {
        repost,
        showNotification,
    }
)(RepostDialog);
