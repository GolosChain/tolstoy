import { connect } from 'react-redux';

//import { toggleCommentInputFocus } from 'app/redux/actions/ui';

import { ReplyBlock } from './ReplyBlock';

export default connect(
  null,
  {
    toggleCommentInputFocus: () => {},
  }
)(ReplyBlock);
