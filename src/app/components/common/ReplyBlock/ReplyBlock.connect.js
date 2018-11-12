import { connect } from 'react-redux';
import { ReplyBlock } from './ReplyBlock';
import { toggleCommentInputFocus } from 'src/app/redux/actions/ui';

export default connect(
    null,
    {
        toggleCommentInputFocus,
    }
)(ReplyBlock);
