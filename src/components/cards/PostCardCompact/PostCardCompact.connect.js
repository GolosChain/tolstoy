import { connect } from 'react-redux';

// import { postCardSelector } from 'app/redux/selectors/post/commonPost';
// import { openRepostDialog } from 'app/redux/actions/dialogs';

import PostCardCompact from './PostCardCompact';

export default connect(
  //postCardSelector,
  () => ({}),
  { openRepostDialog: () => {} }
)(PostCardCompact);
