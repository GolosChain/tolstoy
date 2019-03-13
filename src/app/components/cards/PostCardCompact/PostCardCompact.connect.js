import { connect } from 'react-redux';

// import { postCardSelector } from 'src/app/redux/selectors/post/commonPost';
// import { openRepostDialog } from 'src/app/redux/actions/dialogs';

import PostCardCompact from './PostCardCompact';

export default connect(
    //postCardSelector,
    () => ({}),
    { openRepostDialog: () => {} }
)(PostCardCompact);
