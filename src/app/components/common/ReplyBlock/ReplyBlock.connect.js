import { connect } from 'react-redux';
import { ReplyBlock } from './ReplyBlock';
import { toggleCommentInputFocus } from '../../../redux/actions/ui';

export default connect(
    undefined,
    {
        toggleCommentInputFocus,
    }
)(ReplyBlock);
