import { connect } from 'react-redux';

import { postCardSelector } from 'src/app/redux/selectors/post/commonPost';
import PostCardCompact from './PostCardCompact';

export default connect(postCardSelector)(PostCardCompact);
